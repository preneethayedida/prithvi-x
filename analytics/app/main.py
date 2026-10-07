from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from app.schemas.payload_schemas import (
    IndexRequest,
    AnomalyRequest,
    TrendRequest,
    PredictRequest
)
from app.services.index_calculator import calculate_pei
from app.services.anomaly_detector import detect_anomalies_engine
from app.services.trend_analyzer import analyze_trends
from app.services.ml_predictor import forecast_metric

app = FastAPI(
    title="PRITHVI-X Analytics & Machine Learning Engine",
    description="Mathematical intelligence, explainable anomaly detection, PEI calculation, and temporal forecasting microservice.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "PRITHVI-X Analytics Engine",
        "status": "RUNNING",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "microservice": "PRITHVI-X Python Analytics & ML Core",
        "algorithms": ["Z-Score", "IQR", "IsolationForest", "RandomForestRegressor", "PEI-Composite"]
    }

@app.post("/analytics/index")
def compute_index(payload: IndexRequest):
    try:
        w_dict = payload.weather.model_dump()
        aq_dict = payload.airQuality.model_dump() if payload.airQuality else {}
        result = calculate_pei(w_dict, aq_dict)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/anomaly")
def compute_anomalies(payload: AnomalyRequest):
    try:
        anomalies = detect_anomalies_engine(payload.current, payload.history, payload.regionCode)
        return {"success": True, "data": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/trends")
def compute_trends(payload: TrendRequest):
    try:
        trends = analyze_trends(payload.history)
        return {"success": True, "data": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/predict")
def compute_predictions(payload: PredictRequest):
    try:
        forecast = forecast_metric(payload.history, payload.metric, payload.horizonHours)
        return {"success": True, "data": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
