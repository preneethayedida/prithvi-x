# PRITHVI-X: Academic Project & Viva Review Report

**Project Title:** PRITHVI-X: A Regional Environmental Digital Twin for Environmental Monitoring, Analysis and Visualization  
**Target Category:** Advanced Full-Stack Geospatial & Environmental Intelligence Platform  
**Runtimes & Frameworks:** React 18, Vite, Node.js, Express, MongoDB, Python 3.12, FastAPI, Scikit-Learn, Docker  

---

## 1. Abstract
Environmental monitoring systems often suffer from fragmented architectures, presenting raw, uncontextualized metrics without historical baselines or explainable anomaly tracking. PRITHVI-X addresses this gap by creating an integrated **Regional Environmental Digital Twin**. The system pairs live WMO atmospheric telemetry and near-real-time air quality records with statistical anomaly detection ($Z$-Score, IQR, Isolation Forest), a transparent multi-factor **PRITHVI-X Environmental Index (PEI, 0–100)**, and chronological machine-learning forecasting.

---

## 2. Key Technical Contributions
1. **Multi-Service Microservice Architecture:**
   - Clear decoupling between geospatial presentation (React), API gateway/ingestion orchestration (Node.js), and heavy mathematical modeling (FastAPI/Scikit-Learn).
2. **Dual-Persistence High Availability:**
   - Production Mongoose time-series models complemented by a zero-downtime memory/disk fallback store, guaranteeing that viva demonstrations and automated tests succeed even when external databases or network links are offline.
3. **Transparent Scientific Formulations:**
   - The PRITHVI-X Environmental Index decomposes into four explicit sub-indices (Thermal Comfort, Precipitation Balance, Humidity Stability, and Air Purity) rather than black-box arbitrary numbers.
4. **Temporal Data Leakage Prevention:**
   - The ML prediction module enforces chronological 80/20 train-test splits on historical observations, avoiding the temporal leakage common in naive $k$-fold cross-validation.
5. **Data Provenance & Scientific Ethics:**
   - Explicit tags on every observation record indicate whether data originated from live Open-Meteo ECMWF/GFS grids or calibrated climatological benchmark seeds.

---

## 3. Defense / Viva Q&A Guide

**Q1: Why is PRITHVI-X a "Digital Twin" and not just a weather dashboard?**  
*A:* A weather dashboard simply displays current temperature and wind. A digital twin establishes a persistent digital representation of the geographic region: linking coordinate boundaries, tracking historical climatological baselines, evaluating composite environmental stress (PEI), detecting multi-variate statistical anomalies, and generating forward predictive trajectories.

**Q2: Why was FastAPI chosen alongside Node.js instead of running everything in Python or Node?**  
*A:* Node.js and Express excel at high-concurrency I/O, scheduled background cron ingestion, and client API gateway routing. Python is the industry standard for scientific computation, Pandas data manipulation, and Scikit-Learn machine learning. Decoupling them through REST enables independent scaling and clean separation of concerns.

**Q3: How is data leakage prevented in the ML module?**  
*A:* Standard random train-test splitting leaks future information into past time steps, creating artificially high accuracy. PRITHVI-X strictly partitions the dataset chronologically: the earliest 80% forms the training set, and the newest 20% forms the holdout evaluation set. Evaluation metrics (MAE, RMSE, $R^2$) reflect true out-of-sample performance.
