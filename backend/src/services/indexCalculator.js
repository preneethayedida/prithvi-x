/**
 * PRITHVI-X Environmental Index (PEI) Calculation Engine
 * 
 * Mathematical Formulation:
 * PEI = w_t * S_temp + w_r * S_rain + w_h * S_humidity + w_a * S_aqi
 * 
 * Where:
 * - Weights sum to 1.0 (Default: wt=0.25, wr=0.25, wh=0.20, wa=0.30)
 * - Each component is normalized on a transparent 0-100 scale.
 * - This is an analytical environmental indicator and not an official regulatory index.
 */

const calculateEnvironmentalIndex = (weather, airQuality) => {
  // 1. Temperature Comfort Score (0-100)
  // Optimal: 22°C - 27°C (Score 100)
  // Linear decay towards cold or hot extremes
  const temp = weather.temperature;
  let tempScore = 100;
  if (temp < 22) {
    tempScore = Math.max(0, 100 - (22 - temp) * 4); // 0 at -3°C
  } else if (temp > 27) {
    tempScore = Math.max(0, 100 - (temp - 27) * 4.5); // 0 at ~49°C
  }

  // 2. Rainfall Balance Score (0-100)
  // Normal mild rainfall or dry day with past moisture: 80-100
  // Heavy rainfall (> 30mm/hr) or flash flood risk drops score
  const rain = weather.rainfall || 0;
  let rainScore = 85;
  if (rain === 0) {
    rainScore = 80; // Dry but standard
  } else if (rain > 0 && rain <= 10) {
    rainScore = 95; // Beneficent shower
  } else if (rain > 10 && rain <= 30) {
    rainScore = 75; // Moderate downpour
  } else {
    rainScore = Math.max(20, 100 - (rain - 30) * 2.5); // Intense deluge penalty
  }

  // 3. Humidity Stability Score (0-100)
  // Optimal: 45% - 65%
  const hum = weather.humidity;
  let humScore = 100;
  if (hum < 45) {
    humScore = Math.max(10, 100 - (45 - hum) * 2);
  } else if (hum > 65) {
    humScore = Math.max(10, 100 - (hum - 65) * 2.2); // Humid/sultry penalty
  }

  // 4. Air Quality Score (0-100)
  // US AQI: 0-50 Good (100-90), 51-100 Moderate (89-70), 101-150 Unhealthy Sensitive (69-50),
  // 151-200 Unhealthy (49-30), 201+ Very Unhealthy/Hazardous (<30)
  const aqi = airQuality?.aqi ?? 60;
  let aqiScore = 100;
  if (aqi <= 50) {
    aqiScore = 100 - (aqi / 50) * 10; // 100 -> 90
  } else if (aqi <= 100) {
    aqiScore = 90 - ((aqi - 50) / 50) * 20; // 90 -> 70
  } else if (aqi <= 150) {
    aqiScore = 70 - ((aqi - 100) / 50) * 25; // 70 -> 45
  } else if (aqi <= 200) {
    aqiScore = 45 - ((aqi - 150) / 50) * 25; // 45 -> 20
  } else {
    aqiScore = Math.max(5, 20 - ((aqi - 200) / 100) * 15);
  }

  // Weights
  const weights = {
    temperature: 0.25,
    rainfall: 0.25,
    humidity: 0.20,
    airQuality: 0.30
  };

  const overall = Math.round(
    (tempScore * weights.temperature +
     rainScore * weights.rainfall +
     humScore * weights.humidity +
     aqiScore * weights.airQuality) * 10
  ) / 10;

  // Rating categorization
  let rating = 'GOOD';
  if (overall >= 85) rating = 'OPTIMAL';
  else if (overall >= 70) rating = 'GOOD';
  else if (overall >= 50) rating = 'MODERATE';
  else if (overall >= 30) rating = 'STRESSED';
  else rating = 'CRITICAL';

  // Identify Key Limiting Factor
  const subMap = {
    temperatureComfort: tempScore,
    precipitationBalance: rainScore,
    humidityStability: humScore,
    airQualityIndexScore: aqiScore
  };

  let minKey = 'airQualityIndexScore';
  let minVal = 100;
  for (const [k, v] of Object.entries(subMap)) {
    if (v < minVal) {
      minVal = v;
      minKey = k;
    }
  }

  return {
    overallIndex: overall,
    rating,
    subScores: {
      temperatureComfort: Math.round(tempScore * 10) / 10,
      precipitationBalance: Math.round(rainScore * 10) / 10,
      humidityStability: Math.round(humScore * 10) / 10,
      airQualityIndexScore: Math.round(aqiScore * 10) / 10
    },
    weights,
    keyLimitingFactor: minKey,
    calculatedAt: new Date()
  };
};

module.exports = {
  calculateEnvironmentalIndex
};
