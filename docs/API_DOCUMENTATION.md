# PRITHVI-X REST API Documentation

Base URL: `http://localhost:5000/api`

---

### 1. System Health Probe
- **Endpoint:** `GET /health`
- **Description:** Verifies operational readiness of MongoDB, Python Analytics microservice, and active configuration.
- **Sample Response:**
```json
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "service": "PRITHVI-X Backend API Gateway",
    "database": { "isConnected": false, "readyStateText": "disconnected" },
    "analyticsMicroservice": {
      "isReachable": true,
      "latencyMs": 25,
      "algorithms": ["Z-Score", "IQR", "IsolationForest", "RandomForestRegressor", "PEI-Composite"]
    }
  }
}
```

---

### 2. Monitored Regions Directory
- **Endpoint:** `GET /regions`
- **Description:** Returns all registered geographical regions with coordinate boundaries.
- **Endpoint:** `GET /regions/:id` (Query by code e.g. `IN-AP-BVM` or Mongo ObjectId)

---

### 3. Current Environmental Telemetry
- **Endpoint:** `GET /environment/current/:regionId`
- **Description:** Returns the latest verified environmental observation, air quality metrics, and calculated PEI score.
- **Parameters:** `regionId` (e.g., `IN-AP-BVM`)

---

### 4. Historical Time-Series
- **Endpoint:** `GET /environment/history/:regionId?limit=168`
- **Description:** Returns chronologically ordered hourly observations for charts.
- **Parameters:**
  - `limit`: Number of records (default: 168 = 7 days)

---

### 5. Statistical Trends & Baseline
- **Endpoint:** `GET /environment/trends/:regionId`
- **Description:** Calculates historical mean, min, max, standard deviation, and percentage change.

---

### 6. Explainable Anomaly Detection
- **Endpoint:** `GET /environment/anomalies/:regionId`
- **Description:** Returns all flagged anomalies with mathematical Z-score, expected range, and severity tag (`LOW`, `MODERATE`, `HIGH`, `SEVERE`).

---

### 7. PRITHVI-X Environmental Index (PEI)
- **Endpoint:** `GET /environment/index/:regionId`
- **Description:** Returns the transparent 0-100 index breakdown and 4 sub-scores (Thermal, Precipitation, Humidity, Air Quality).

---

### 8. Natural Language Environmental Insights
- **Endpoint:** `GET /environment/insights/:regionId`
- **Description:** Returns explainable text observations derived from real baseline deviations.

---

### 9. Multi-Region Comparison
- **Endpoint:** `GET /environment/compare?regionIds=IN-AP-BVM,IN-AP-VJA,IN-AP-VSP`
- **Description:** Returns comparative matrix and radar profile coordinates.

---

### 10. Machine Learning Trajectory Forecasting
- **Endpoint:** `GET /environment/forecast/:regionId?metric=temperature&horizon=24`
- **Description:** Predicts forward trajectory using Random Forest autoregressive models and returns MAE, RMSE, and $R^2$ evaluation metrics.
