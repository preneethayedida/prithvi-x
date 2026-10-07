from typing import Dict, Any

def calculate_pei(weather: Dict[str, Any], air_quality: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Transparent PRITHVI-X Environmental Index (PEI)
    Range: 0 - 100
    Weights: Temperature 0.25, Rainfall 0.25, Humidity 0.20, Air Quality 0.30
    """
    temp = float(weather.get("temperature", 28.0))
    rain = float(weather.get("rainfall", 0.0) or 0.0)
    hum = float(weather.get("humidity", 60.0))
    
    aqi_data = air_quality or {}
    aqi = float(aqi_data.get("aqi", 55.0) or 55.0)

    # 1. Temperature Comfort (Optimal: 22 - 27 C)
    if temp < 22.0:
        temp_score = max(0.0, 100.0 - (22.0 - temp) * 4.0)
    elif temp > 27.0:
        temp_score = max(0.0, 100.0 - (temp - 27.0) * 4.5)
    else:
        temp_score = 100.0

    # 2. Precipitation Balance
    if rain == 0.0:
        rain_score = 80.0
    elif 0.0 < rain <= 10.0:
        rain_score = 95.0
    elif 10.0 < rain <= 30.0:
        rain_score = 75.0
    else:
        rain_score = max(20.0, 100.0 - (rain - 30.0) * 2.5)

    # 3. Humidity Stability (Optimal: 45% - 65%)
    if hum < 45.0:
        hum_score = max(10.0, 100.0 - (45.0 - hum) * 2.0)
    elif hum > 65.0:
        hum_score = max(10.0, 100.0 - (hum - 65.0) * 2.2)
    else:
        hum_score = 100.0

    # 4. Air Quality Score (0-500 scale inverted to 0-100)
    if aqi <= 50.0:
        aqi_score = 100.0 - (aqi / 50.0) * 10.0
    elif aqi <= 100.0:
        aqi_score = 90.0 - ((aqi - 50.0) / 50.0) * 20.0
    elif aqi <= 150.0:
        aqi_score = 70.0 - ((aqi - 100.0) / 50.0) * 25.0
    elif aqi <= 200.0:
        aqi_score = 45.0 - ((aqi - 150.0) / 50.0) * 25.0
    else:
        aqi_score = max(5.0, 20.0 - ((aqi - 200.0) / 100.0) * 15.0)

    weights = {
        "temperature": 0.25,
        "rainfall": 0.25,
        "humidity": 0.20,
        "airQuality": 0.30
    }

    overall = round(
        temp_score * weights["temperature"] +
        rain_score * weights["rainfall"] +
        hum_score * weights["humidity"] +
        aqi_score * weights["airQuality"],
        1
    )

    if overall >= 85:
        rating = "OPTIMAL"
    elif overall >= 70:
        rating = "GOOD"
    elif overall >= 50:
        rating = "MODERATE"
    elif overall >= 30:
        rating = "STRESSED"
    else:
        rating = "CRITICAL"

    sub_map = {
        "temperatureComfort": temp_score,
        "precipitationBalance": rain_score,
        "humidityStability": hum_score,
        "airQualityIndexScore": aqi_score
    }
    limiting_factor = min(sub_map, key=sub_map.get)

    return {
        "overallIndex": overall,
        "rating": rating,
        "subScores": {
            "temperatureComfort": round(temp_score, 1),
            "precipitationBalance": round(rain_score, 1),
            "humidityStability": round(hum_score, 1),
            "airQualityIndexScore": round(aqi_score, 1)
        },
        "weights": weights,
        "keyLimitingFactor": limiting_factor
    }
