# PRITHVI-X Data Sources & Data Governance

## 1. Primary Live Provider: Open-Meteo
- **Weather API:** `https://api.open-meteo.com/v1/forecast`
- **Air Quality API:** `https://air-quality-api.open-meteo.com/v1/air-quality`
- **License:** Open Access under CC BY 4.0
- **Authentication:** Zero API key requirement (high reliability, no billing interruption)
- **Model Standard:** Integrated European Centre for Medium-Range Weather Forecasts (ECMWF) and NOAA GFS high-resolution models.
- **Coverage:** Global coverage with high-precision coordinate interpolation for Indian sub-districts (e.g. Bhimavaram, Vijayawada, Visakhapatnam).

## 2. Resilience Fallback: Climatological Benchmark Seed Engine
- **Purpose:** Ensures 100% operational uptime, offline demonstration capabilities, and reproducible test suites when external networks are unreachable.
- **Formulation:** Deterministic sinusoidal diurnal cycling models calibrated to historical regional climate norms (Köppen climate classes).
- **Transparency:** All fallback observations explicitly carry:
  - `source.provider: 'CLIMATOLOGICAL_SEED_FALLBACK'`
  - `source.isEstimated: true`
  - `source.stationOrGrid: 'Climatological Seed Reference'`

## 3. Data Ingestion & Sanitization Rules
1. **Temperature:** Plausibility bounds $[-50^\circ\text{C}, 60^\circ\text{C}]$.
2. **Precipitation:** Clamped to $\ge 0\text{ mm}$, upper burst filter at $600\text{ mm/hr}$.
3. **Humidity:** Strict range $[0\%, 100\%]$.
4. **Surface Pressure:** Barometric range $[850, 1090]\text{ hPa}$.
5. **Air Quality:** Inverted US AQI standard range $[0, 500]$.
