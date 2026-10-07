# PRITHVI-X Database Schema Documentation

PRITHVI-X uses MongoDB with Mongoose for structured time-series persistence, complemented by compound indexes for low-latency queries.

---

## 1. `regions` Collection
Stores regional administrative boundaries, Köppen climate classification, and coordinate centroids.

| Field | Type | Description |
|---|---|---|
| `code` | String | Unique ISO-style regional identifier (e.g., `IN-AP-BVM`) [Indexed] |
| `name` | String | Common regional name (e.g., `Bhimavaram`) |
| `district` | String | Administrative district (e.g., `West Godavari`) |
| `state` | String | State (e.g., `Andhra Pradesh`) |
| `country` | String | Country (default: `India`) |
| `coordinates.latitude` | Number | WGS84 Latitude |
| `coordinates.longitude` | Number | WGS84 Longitude |
| `coordinates.elevation` | Number | Elevation in meters MSL |
| `boundingBox` | Object | `{ north, south, east, west }` coordinate polygon bounds |
| `climateZone` | String | Köppen climate classification (e.g., `Tropical wet and dry (Aw)`) |
| `isActive` | Boolean | Operational flag |

---

## 2. `environmentalObservations` Collection
Stores high-resolution time-series observations.

| Field | Type | Description |
|---|---|---|
| `regionId` | ObjectId | Reference to `regions._id` |
| `regionCode` | String | Denormalized region code [Compound Indexed] |
| `timestamp` | Date | Observation timestamp [Compound Indexed] |
| `weather.temperature` | Number | Ambient dry-bulb temperature (°C) |
| `weather.feelsLike` | Number | Calculated apparent temperature (°C) |
| `weather.humidity` | Number | Relative humidity (0–100%) |
| `weather.rainfall` | Number | Precipitation rate (mm/hr) |
| `weather.windSpeed` | Number | 10m wind speed (km/h) |
| `weather.surfacePressure` | Number | Barometric surface pressure (hPa) |
| `airQuality.aqi` | Number | Standard US AQI scale (0–500) |
| `airQuality.pm2_5` | Number | PM2.5 concentration (µg/m³) |
| `airQuality.pm10` | Number | PM10 concentration (µg/m³) |
| `source.provider` | String | `OPEN_METEO` or `CLIMATOLOGICAL_SEED_FALLBACK` |
| `source.isEstimated` | Boolean | Transparency flag indicating estimated vs live grid telemetry |

**Index Definitions:**
- `{ regionId: 1, timestamp: -1 }`
- `{ regionCode: 1, timestamp: -1 }`

---

## 3. `anomalies` Collection
Stores detected statistical deviations and multivariate outliers.

| Field | Type | Description |
|---|---|---|
| `regionCode` | String | Monitored region |
| `timestamp` | Date | Timestamp of anomalous event |
| `metric` | String | `temperature`, `rainfall`, `humidity`, `airQuality`, `compound` |
| `observedValue` | Number | Recorded empirical value |
| `baseline.mean` | Number | Rolling historical average |
| `deviation` | Number | Absolute delta from baseline mean |
| `zScore` | Number | Statistical standard deviations from mean |
| `severity` | String | `LOW`, `MODERATE`, `HIGH`, `SEVERE` |
| `method` | String | `Z_SCORE_AND_BASELINE`, `INTERQUARTILE_RANGE`, `ISOLATION_FOREST` |
| `explanation` | String | Non-alarmist grounded explanation |

---

## 4. `environmentalIndexes` Collection
Stores the calculated composite PRITHVI-X Environmental Index (PEI).

| Field | Type | Description |
|---|---|---|
| `regionCode` | String | Region identifier |
| `timestamp` | Date | Computation timestamp |
| `overallIndex` | Number | 0–100 Composite score |
| `rating` | String | `OPTIMAL`, `GOOD`, `MODERATE`, `STRESSED`, `CRITICAL` |
| `subScores` | Object | `{ temperatureComfort, precipitationBalance, humidityStability, airQualityIndexScore }` |
| `keyLimitingFactor` | String | Metric currently exerting the highest pressure on the regional index |
