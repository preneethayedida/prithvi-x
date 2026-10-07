import math
import numpy as np
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest

def detect_anomalies_engine(current: Dict[str, Any], history: List[Dict[str, Any]], region_code: str = "IN-AP-BVM") -> List[Dict[str, Any]]:
    anomalies = []
    if not history or len(history) < 5:
        return anomalies

    weather = current.get("weather", {})
    air_quality = current.get("airQuality", {})

    temp_curr = weather.get("temperature", current.get("temperature"))
    rain_curr = weather.get("rainfall", current.get("rainfall", 0.0))
    hum_curr = weather.get("humidity", current.get("humidity"))
    aqi_curr = air_quality.get("aqi", current.get("aqi"))

    temp_hist = [h.get("temperature") or h.get("weather", {}).get("temperature") for h in history]
    temp_hist = [float(v) for v in temp_hist if v is not None]

    rain_hist = [float(h.get("rainfall") or h.get("weather", {}).get("rainfall") or 0.0) for h in history]
    hum_hist = [float(h.get("humidity") or h.get("weather", {}).get("humidity") or 50.0) for h in history]
    aqi_hist = [float(h.get("aqi") or h.get("airQuality", {}).get("aqi") or 50.0) for h in history]

    # 1. Temperature Z-Score
    if temp_curr is not None and len(temp_hist) >= 5:
        mean_t = np.mean(temp_hist)
        std_t = np.std(temp_hist) or 1.0
        z_t = (temp_curr - mean_t) / std_t
        if abs(z_t) >= 2.0:
            severity = "SEVERE" if abs(z_t) >= 3.0 else ("HIGH" if abs(z_t) >= 2.5 else "MODERATE")
            sign = "+" if (temp_curr - mean_t) > 0 else ""
            anomalies.append({
                "regionCode": region_code,
                "metric": "temperature",
                "observedValue": float(temp_curr),
                "baseline": {
                    "mean": round(float(mean_t), 1),
                    "expectedMin": round(float(mean_t - 2 * std_t), 1),
                    "expectedMax": round(float(mean_t + 2 * std_t), 1)
                },
                "deviation": round(float(temp_curr - mean_t), 1),
                "zScore": round(float(z_t), 2),
                "severity": severity,
                "method": "Z_SCORE_AND_BASELINE",
                "explanation": f"Observed temperature ({temp_curr}°C) deviates by {sign}{round(float(temp_curr - mean_t), 1)}°C from the historical mean ({round(float(mean_t), 1)}°C, Z={round(float(z_t), 2)})."
            })

    # 2. Rainfall IQR Check
    if rain_curr and rain_curr > 0 and len(rain_hist) >= 5:
        q1 = np.percentile(rain_hist, 25)
        q3 = np.percentile(rain_hist, 75)
        iqr = q3 - q1
        outlier_thresh = q3 + (1.5 * (iqr if iqr > 0 else 5.0))
        if rain_curr > outlier_thresh and rain_curr >= 15.0:
            severity = "SEVERE" if rain_curr >= 50.0 else ("HIGH" if rain_curr >= 30.0 else "MODERATE")
            anomalies.append({
                "regionCode": region_code,
                "metric": "rainfall",
                "observedValue": float(rain_curr),
                "baseline": {
                    "mean": round(float(np.mean(rain_hist)), 1),
                    "expectedMin": 0.0,
                    "expectedMax": round(float(outlier_thresh), 1)
                },
                "deviation": round(float(rain_curr - np.mean(rain_hist)), 1),
                "zScore": round(float((rain_curr - np.mean(rain_hist)) / (np.std(rain_hist) or 1.0)), 2),
                "severity": severity,
                "method": "INTERQUARTILE_RANGE",
                "explanation": f"Precipitation surge of {rain_curr} mm exceeds upper IQR bound ({round(float(outlier_thresh), 1)} mm)."
            })

    # 3. Multivariate Isolation Forest check if enough samples exist
    if len(temp_hist) >= 20 and len(hum_hist) >= 20:
        try:
            X_hist = np.column_stack([temp_hist, hum_hist, aqi_hist])
            iso = IsolationForest(contamination=0.05, random_state=42)
            iso.fit(X_hist)
            X_curr = np.array([[float(temp_curr or 28), float(hum_curr or 60), float(aqi_curr or 50)]])
            pred = iso.predict(X_curr)
            if pred[0] == -1 and len(anomalies) == 0:
                # Flagged by Isolation Forest as a compound anomaly
                anomalies.append({
                    "regionCode": region_code,
                    "metric": "compound",
                    "observedValue": float(temp_curr or 28),
                    "baseline": {
                        "mean": round(float(np.mean(temp_hist)), 1),
                        "expectedMin": round(float(np.min(temp_hist)), 1),
                        "expectedMax": round(float(np.max(temp_hist)), 1)
                    },
                    "deviation": 0.0,
                    "zScore": 0.0,
                    "severity": "MODERATE",
                    "method": "ISOLATION_FOREST_MULTIVARIATE",
                    "explanation": "Multivariate Isolation Forest identified atypical compounding interaction between temperature, humidity, and atmospheric conditions."
                })
        except Exception:
            pass

    return anomalies
