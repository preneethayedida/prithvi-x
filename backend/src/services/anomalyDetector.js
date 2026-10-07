/**
 * PRITHVI-X Statistical Anomaly Detection Engine
 * Uses explainable statistical metrics: Z-Score, IQR, and Rolling Mean Baseline Deviations.
 */

const detectAnomalies = (currentObs, historicalSeries = [], regionCode) => {
  const anomalies = [];
  if (!historicalSeries || historicalSeries.length < 5) {
    // Insufficient history for robust statistical baseline
    return anomalies;
  }

  const weather = currentObs.weather;
  const aqi = currentObs.airQuality;

  // Helper: Mean & Standard Deviation
  const calcStats = (vals) => {
    if (vals.length === 0) return { mean: 0, std: 1, min: 0, max: 0 };
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const std = Math.sqrt(variance) || 1;
    const sorted = [...vals].sort((a, b) => a - b);
    return {
      mean,
      std,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      q1: sorted[Math.floor(sorted.length * 0.25)],
      q3: sorted[Math.floor(sorted.length * 0.75)]
    };
  };

  const tempVals = historicalSeries.map(h => h.temperature ?? h.weather?.temperature).filter(v => v !== undefined);
  const rainVals = historicalSeries.map(h => h.rainfall ?? h.weather?.rainfall ?? 0);
  const humVals = historicalSeries.map(h => h.humidity ?? h.weather?.humidity).filter(v => v !== undefined);
  const aqiVals = historicalSeries.map(h => h.aqi ?? h.airQuality?.aqi).filter(v => v !== undefined);

  // 1. Temperature Anomaly Check
  if (tempVals.length >= 5) {
    const stats = calcStats(tempVals);
    const zScore = (weather.temperature - stats.mean) / stats.std;
    const deviation = Math.round((weather.temperature - stats.mean) * 10) / 10;

    if (Math.abs(zScore) >= 2.0) {
      let severity = 'MODERATE';
      if (Math.abs(zScore) >= 3.0) severity = 'SEVERE';
      else if (Math.abs(zScore) >= 2.5) severity = 'HIGH';

      const sign = deviation > 0 ? '+' : '';
      const expRangeMin = Math.round((stats.mean - 2 * stats.std) * 10) / 10;
      const expRangeMax = Math.round((stats.mean + 2 * stats.std) * 10) / 10;

      anomalies.push({
        regionId: currentObs.regionId,
        regionCode,
        timestamp: currentObs.timestamp || new Date(),
        metric: 'temperature',
        observedValue: weather.temperature,
        baseline: {
          mean: Math.round(stats.mean * 10) / 10,
          expectedMin: expRangeMin,
          expectedMax: expRangeMax
        },
        deviation,
        zScore: Math.round(zScore * 100) / 100,
        severity,
        method: 'Z_SCORE_AND_BASELINE',
        explanation: `Temperature of ${weather.temperature}°C deviates by ${sign}${deviation}°C from regional historical mean (${Math.round(stats.mean * 10) / 10}°C, Z-score: ${Math.round(zScore * 100) / 100}).`
      });
    }
  }

  // 2. Rainfall Anomaly Check (Using IQR for skewed precipitation)
  if (rainVals.length >= 5 && weather.rainfall > 0) {
    const stats = calcStats(rainVals);
    const iqr = stats.q3 - stats.q1;
    const outlierThreshold = stats.q3 + (1.5 * (iqr || 5));

    if (weather.rainfall > outlierThreshold && weather.rainfall >= 15) {
      const severity = weather.rainfall >= 50 ? 'SEVERE' : (weather.rainfall >= 30 ? 'HIGH' : 'MODERATE');
      anomalies.push({
        regionId: currentObs.regionId,
        regionCode,
        timestamp: currentObs.timestamp || new Date(),
        metric: 'rainfall',
        observedValue: weather.rainfall,
        baseline: {
          mean: Math.round(stats.mean * 10) / 10,
          expectedMin: 0,
          expectedMax: Math.round(outlierThreshold * 10) / 10
        },
        deviation: Math.round((weather.rainfall - stats.mean) * 10) / 10,
        zScore: Math.round(((weather.rainfall - stats.mean) / (stats.std || 1)) * 100) / 100,
        severity,
        method: 'INTERQUARTILE_RANGE',
        explanation: `Precipitation pulse of ${weather.rainfall} mm/hr exceeds standard upper threshold of ${Math.round(outlierThreshold * 10) / 10} mm for this region.`
      });
    }
  }

  // 3. Air Quality Anomaly Check
  if (aqiVals.length >= 5 && aqi?.aqi) {
    const stats = calcStats(aqiVals);
    const zScore = (aqi.aqi - stats.mean) / stats.std;

    if (zScore >= 2.0 && aqi.aqi > 100) {
      const severity = aqi.aqi >= 200 ? 'SEVERE' : (aqi.aqi >= 150 ? 'HIGH' : 'MODERATE');
      anomalies.push({
        regionId: currentObs.regionId,
        regionCode,
        timestamp: currentObs.timestamp || new Date(),
        metric: 'airQuality',
        observedValue: aqi.aqi,
        baseline: {
          mean: Math.round(stats.mean * 10) / 10,
          expectedMin: Math.max(0, Math.round((stats.mean - stats.std) * 10) / 10),
          expectedMax: Math.round((stats.mean + stats.std) * 10) / 10
        },
        deviation: Math.round((aqi.aqi - stats.mean) * 10) / 10,
        zScore: Math.round(zScore * 100) / 100,
        severity,
        method: 'Z_SCORE_AND_AQI_THRESHOLDS',
        explanation: `Air Quality Index of ${aqi.aqi} is ${Math.round((aqi.aqi - stats.mean) * 10) / 10} points higher than historical regional average (${Math.round(stats.mean * 10) / 10}).`
      });
    }
  }

  // 4. Humidity Anomaly Check
  if (humVals.length >= 5) {
    const stats = calcStats(humVals);
    const zScore = (weather.humidity - stats.mean) / stats.std;

    if (Math.abs(zScore) >= 2.2) {
      const severity = Math.abs(zScore) >= 3.0 ? 'HIGH' : 'MODERATE';
      anomalies.push({
        regionId: currentObs.regionId,
        regionCode,
        timestamp: currentObs.timestamp || new Date(),
        metric: 'humidity',
        observedValue: weather.humidity,
        baseline: {
          mean: Math.round(stats.mean * 10) / 10,
          expectedMin: Math.round(stats.q1 * 10) / 10,
          expectedMax: Math.round(stats.q3 * 10) / 10
        },
        deviation: Math.round((weather.humidity - stats.mean) * 10) / 10,
        zScore: Math.round(zScore * 100) / 100,
        severity,
        method: 'Z_SCORE',
        explanation: `Relative humidity at ${weather.humidity}% is significantly ${weather.humidity > stats.mean ? 'higher' : 'lower'} than the typical ${Math.round(stats.mean)}% norm.`
      });
    }
  }

  return anomalies;
};

module.exports = {
  detectAnomalies
};
