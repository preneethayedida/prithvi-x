import numpy as np
from typing import List, Dict, Any

def analyze_trends(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not history:
        return {"sampleCount": 0, "metrics": {}}

    def extract_stats(vals):
        clean = [float(v) for v in vals if v is not None]
        if not clean:
            return {"current": 0, "avg": 0, "min": 0, "max": 0, "deltaPercent": 0, "trend": "STABLE"}
        current = clean[-1]
        avg = float(np.mean(clean))
        c_min = float(np.min(clean))
        c_max = float(np.max(clean))
        delta = round(((current - avg) / avg * 100), 1) if avg != 0 else 0.0
        
        trend = "STABLE"
        if delta > 5.0:
            trend = "RISING"
        elif delta < -5.0:
            trend = "FALLING"

        return {
            "current": round(current, 1),
            "avg": round(avg, 1),
            "min": round(c_min, 1),
            "max": round(c_max, 1),
            "deltaPercent": delta,
            "trend": trend
        }

    temps = [h.get("temperature") or h.get("weather", {}).get("temperature") for h in history]
    hums = [h.get("humidity") or h.get("weather", {}).get("humidity") for h in history]
    rains = [h.get("rainfall") or h.get("weather", {}).get("rainfall") or 0.0 for h in history]
    winds = [h.get("windSpeed") or h.get("weather", {}).get("windSpeed") or 0.0 for h in history]
    aqis = [h.get("aqi") or h.get("airQuality", {}).get("aqi") or 50.0 for h in history]

    return {
        "sampleCount": len(history),
        "temperature": extract_stats(temps),
        "humidity": extract_stats(hums),
        "rainfall": extract_stats(rains),
        "windSpeed": extract_stats(winds),
        "aqi": extract_stats(aqis)
    }
