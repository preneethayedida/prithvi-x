# PRITHVI-X: Regional Environmental Digital Twin Platform

[![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20FastAPI%20%7C%20MongoDB-cyan.svg)](https://github.com)

**PRITHVI-X: A Regional Environmental Digital Twin for Environmental Monitoring, Analysis, and Visualization**

A production-quality full-stack environmental intelligence platform engineered to reconstruct and monitor geographic regions digitally. Integrating live WMO atmospheric telemetry, air quality metrics, historical time-series baselines, explainable anomaly detection, multi-factor environmental indexing, and chronological machine-learning forecasting.

---

## 1. Problem Statement & Solution

Traditional weather portals operate as fragmented dashboards that present raw numbers without historical context, environmental stress aggregation, or explainable anomalies. 

**PRITHVI-X** resolves this by operating as a true **Regional Environmental Digital Twin**:
- **Where am I looking?** Precise coordinate-level regional boundaries and Köppen climate zones.
- **What is happening now?** Real-time verified telemetry for temperature, humidity, rainfall, wind, barometric pressure, and atmospheric chemistry ($PM_{2.5}, PM_{10}, NO_2, SO_2, O_3, CO, AQI$).
- **Is anything unusual?** Statistical Z-Score, IQR, and Isolation Forest anomaly engines with plain-language justifications.
- **How has it changed?** Granular 24h, 7d, 14d, and 30d historical time-series with trend momentum.
- **Why does it matter?** Transparent composite **PRITHVI-X Environmental Index (PEI, 0–100)** with sub-score breakdowns.
- **What lies ahead?** Chronological Random Forest forecasting models trained strictly on historical holdouts (zero data leakage).

---

## 2. Key Features

- 🌍 **Geospatial Digital Twin Canvas:** Interactive Leaflet map with dynamic layer overlays (Temperature, Rainfall, Humidity, AQI, PEI) and click-to-telemetry drawer.
- 📊 **PRITHVI-X Environmental Index (PEI):** Transparent 0–100 scale balancing Thermal Comfort (25%), Precipitation Balance (25%), Humidity Stability (20%), and Air Purity (30%).
- 🚨 **Explainable Anomaly Detection:** Flags deviations with exact Z-scores, standard deviations, and non-alarmist scientific explanations.
- 📈 **Historical Deep-Dive Analytics:** Interactive Recharts graphs with statistical min/max/mean moments and delta percentages.
- 🔬 **Regional Comparison Cockpit:** Benchmarks multiple regional twins (e.g. Bhimavaram vs Vijayawada vs Visakhapatnam) with tabular matrices and radar profiles.
- 🤖 **Chronological ML Forecasting:** Autoregressive Random Forest models with explicit MAE, RMSE, and $R^2$ performance metrics and forward confidence intervals.
- 🛡️ **Resilient Dual-Data Architecture:** Primary live Open-Meteo API integration with automatic fallback to calibrated climatological benchmark seeds for zero-downtime demos.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────┐
│               EXTERNAL DATA PROVIDERS                  │
│   - Open-Meteo WMO Weather API (Zero API key required) │
│   - Open-Meteo Atmospheric Chemistry / AQI API         │
│   - PRITHVI Climatological Seed Fallback Engine        │
└──────────────────────────┬─────────────────────────────┘
                           │ Ingestion & Sanitization
                           ▼
┌────────────────────────────────────────────────────────┐
│           NODE.JS / EXPRESS API GATEWAY                │
│   - REST API Controller Layer                          │
│   - Automated Ingestion Worker (node-cron)             │
│   - Dual-Persistence (MongoDB Mongoose + In-Memory)    │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       FASTAPI ANALYTICS      │ │      REACT DIGITAL TWIN      │
│ - Z-Score / IQR Filter       │ │ - Leaflet Map Canvas         │
│ - Isolation Forest Outliers  │ │ - Recharts Analytics Graphs  │
│ - PEI Composite 0-100 Engine │ │ - PEI Score Gauge & Cards    │
│ - Chronological ML Predictor │ │ - Region Directory & Compare │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 4. Technology Stack

- **Frontend:** React 18, Vite, React-Leaflet, Leaflet, Recharts, Lucide-React, Vanilla CSS Design System.
- **Backend:** Node.js 20+, Express.js, Mongoose, Axios, node-cron, Helmet, Morgan.
- **Analytics & ML:** Python 3.12, FastAPI, Uvicorn, Pandas, NumPy, Scikit-Learn, SciPy.
- **Database:** MongoDB 7.0+ (with resilient in-memory / disk cache fallback).
- **DevOps:** Docker, Docker Compose, Multi-stage Dockerfiles, Nginx.

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
# Install backend and frontend dependencies
npm run install:all

# Set up Python Analytics venv
cd analytics
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
cd ..
```

### 3. Start Development Services
Run Backend and Frontend simultaneously:
```bash
npm run dev
```

In a second terminal, start the Python Analytics microservice:
```bash
cd analytics
.\venv\Scripts\uvicorn.exe app.main:app --port 8000
```

### 4. Access the Platform
- **Frontend SPA:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **FastAPI Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 6. Docker Containerization

To run all services containerized:
```bash
docker-compose up --build -d
```
Services will be accessible at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Analytics: `http://localhost:8000`
- MongoDB: `localhost:27017`

---

## 7. Automated Testing

### Backend Test Suite
```bash
cd backend
npm test
```
*Executes unit and data-sanitization tests using Node.js native test runner.*

### Analytics Test Suite
```bash
cd analytics
.\venv\Scripts\python -m pytest tests/test_analytics.py
```
*Validates PEI mathematical scoring, anomaly detection, and ML forecasting pipelines.*

---

## 8. Limitations & Future Scope

### Current Limitations
- Machine learning predictions rely on historical hourly lag patterns and do not incorporate multi-spectral satellite imagery.
- Air quality parameters are currently interpolated from global atmospheric dispersion models rather than local ground IoT sensor nodes.

### Future Roadmap
- IoT hardware integration (ESP32/LoRaWAN regional sensor nodes).
- Sentinel-2 satellite multi-spectral NDVI (Normalized Difference Vegetation Index) processing.
- Hyperlocal flood and flash-deluge basin modeling.

---

## 9. Academic Defense & Viva Highlights

- **Explainable Anomaly Detection:** Implements dual-threshold Z-Score and Interquartile Range (IQR) checks to separate seasonal shifts from true statistical anomalies.
- **Zero Temporal Leakage:** Time-series training strictly partitions historical data chronologically (80% training on older records, 20% validation on subsequent holdouts).
- **Production Resilience:** The backend will never fail or return blank pages even if external network APIs or local MongoDB daemons are offline.

---

## 10. License
Released under the [MIT License](LICENSE).
