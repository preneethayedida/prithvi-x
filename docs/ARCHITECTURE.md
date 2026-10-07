# PRITHVI-X Architecture Documentation

## 1. System Overview
PRITHVI-X is a decoupled multi-service Regional Environmental Digital Twin engineered for atmospheric monitoring, historical trend analysis, explainable anomaly detection, and machine-learning forecasting.

```
┌─────────────────────────────────┐
│     Client Web Presentation     │  React 18, Leaflet, Recharts, CSS Design Tokens
└────────────────┬────────────────┘
                 │ HTTP / JSON REST
                 ▼
┌─────────────────────────────────┐
│    Backend API Gateway (Node)   │  Express, Ingestion Worker, Fallback Resilience
└────────┬───────────────┬────────┘
         │               │
         ▼               ▼
┌─────────────────┐  ┌─────────────────────────────────┐
│ MongoDB Storage │  │ Python Analytics Microservice   │
│ - Regions       │  │ - Explainable Anomaly Detection │
│ - Observations  │  │ - PRITHVI-X Environmental Index │
│ - Anomalies     │  │ - Chronological ML Forecasting  │
│ - Indexes       │  └─────────────────────────────────┘
└─────────────────┘
```

## 2. Microservice Decomposition
1. **Frontend (`/frontend`)**:
   - Single Page Application built on React 18 and Vite.
   - Geospatial rendering powered by Leaflet & CartoDB Dark Matter tiles.
   - Time-series analytics with Recharts (Area, Line, Radar, Bar).
   - Global region context syncing state across pages without page reloads.

2. **Backend API Gateway (`/backend`)**:
   - Express.js application exposing standardized REST endpoints.
   - Dual-persistence architecture: MongoDB Mongoose with graceful fallback to disk-cached memory store.
   - Ingestion Worker: Background scheduled sync (`node-cron`) pulling weather and AQI telemetry.
   - Provider Registry: Auto-switches between Open-Meteo live endpoints and scientific climatological fallback models.

3. **Analytics & Machine Learning Engine (`/analytics`)**:
   - Python 3.11 with FastAPI, Pandas, NumPy, and Scikit-Learn.
   - Fast asynchronous endpoints for anomaly detection, index calculation, trend statistics, and autoregressive forecasting.

## 3. Communication Standards
All inter-service and client-server REST responses adhere to a uniform structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Human readable status string.",
  "timestamp": "ISO-8601"
}
```
Errors return clear diagnostic codes without exposing raw stack traces:
```json
{
  "success": false,
  "error": {
    "code": "REGION_NOT_FOUND",
    "message": "The specified region identifier does not exist."
  },
  "timestamp": "ISO-8601"
}
```
