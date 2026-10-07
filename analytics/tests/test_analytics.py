import pytest
from app.services.index_calculator import calculate_pei
from app.services.anomaly_detector import detect_anomalies_engine
from app.services.trend_analyzer import analyze_trends
from app.services.ml_predictor import forecast_metric

def test_calculate_pei():
    weather = {"temperature": 25.0, "rainfall": 2.0, "humidity": 55.0}
    air_quality = {"aqi": 40.0}
    res = calculate_pei(weather, air_quality)
    assert 0 <= res["overallIndex"] <= 100
    assert res["rating"] == "OPTIMAL"
    assert "subScores" in res

def test_detect_anomalies():
    current = {"weather": {"temperature": 42.0, "humidity": 50.0, "rainfall": 0.0}}
    history = [{"weather": {"temperature": 28.0 + (i % 3)}} for i in range(25)]
    anoms = detect_anomalies_engine(current, history, "IN-AP-BVM")
    assert len(anoms) > 0
    assert anoms[0]["metric"] == "temperature"
    assert anoms[0]["zScore"] > 2.0

def test_analyze_trends():
    history = [{"weather": {"temperature": 28.0 + i, "rainfall": 0.0, "humidity": 60.0}} for i in range(10)]
    trends = analyze_trends(history)
    assert trends["sampleCount"] == 10
    assert trends["temperature"]["trend"] in ["RISING", "STABLE", "FALLING"]

def test_ml_forecasting_chronological():
    history = [
        {"timestamp": f"2026-10-0{1 + (i // 24)}T{(i % 24):02d}:00:00Z", "temperature": 28.0 + (i % 8)}
        for i in range(48)
    ]
    forecast = forecast_metric(history, "temperature", 12)
    assert forecast["metric"] == "temperature"
    assert len(forecast["predictions"]) == 12
    assert "evaluation" in forecast
    assert forecast["evaluation"]["mae"] is not None
    assert "disclaimer" in forecast
