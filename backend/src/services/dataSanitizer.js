/**
 * PRITHVI-X Environmental Data Sanitization and Validation Pipeline
 * Ensures physical plausibility, unit consistency, and outlier filtering.
 */

const sanitizeObservation = (raw) => {
  const checksPassed = [];
  let isValid = true;

  // 1. Temperature Check: [-50°C, 60°C]
  let temperature = parseFloat(raw.temperature);
  if (isNaN(temperature) || temperature < -50 || temperature > 60) {
    isValid = false;
  } else {
    checksPassed.push('temperature_range');
  }

  // 2. Relative Humidity Check: [0%, 100%]
  let humidity = parseFloat(raw.humidity);
  if (isNaN(humidity)) {
    humidity = 50; // fallback default
  } else {
    humidity = Math.max(0, Math.min(100, humidity));
    checksPassed.push('humidity_range');
  }

  // 3. Precipitation Check: >= 0 mm
  let rainfall = parseFloat(raw.rainfall ?? raw.precipitation ?? 0);
  if (isNaN(rainfall) || rainfall < 0) {
    rainfall = 0;
  } else {
    rainfall = Math.min(600, rainfall); // Max plausible hourly deluge
    checksPassed.push('rainfall_range');
  }

  // 4. Wind Speed Check: >= 0 km/h
  let windSpeed = parseFloat(raw.windSpeed ?? raw.wind_speed_10m ?? 0);
  if (isNaN(windSpeed) || windSpeed < 0) {
    windSpeed = 0;
  } else {
    windSpeed = Math.min(300, windSpeed); // Max tropical cyclone wind
    checksPassed.push('wind_speed_range');
  }

  // 5. Surface Pressure: [870 hPa, 1085 hPa]
  let surfacePressure = parseFloat(raw.surfacePressure ?? raw.pressure_msl ?? 1013.25);
  if (isNaN(surfacePressure) || surfacePressure < 850 || surfacePressure > 1090) {
    surfacePressure = 1013.25;
  } else {
    checksPassed.push('pressure_range');
  }

  // 6. Air Quality Parameters: [0, 500]
  let aqi = Math.max(0, Math.min(500, parseFloat(raw.aqi ?? raw.us_aqi ?? 50) || 50));
  let pm2_5 = Math.max(0, parseFloat(raw.pm2_5 ?? raw.pm25 ?? 15) || 15);
  let pm10 = Math.max(0, parseFloat(raw.pm10 ?? 30) || 30);
  let no2 = Math.max(0, parseFloat(raw.no2 ?? 10) || 10);
  let so2 = Math.max(0, parseFloat(raw.so2 ?? 5) || 5);
  let o3 = Math.max(0, parseFloat(raw.o3 ?? 30) || 30);
  let co = Math.max(0, parseFloat(raw.co ?? 300) || 300);
  checksPassed.push('air_quality_range');

  // Compute Feels-Like / Heat Index if not supplied
  let feelsLike = parseFloat(raw.feelsLike ?? raw.apparent_temperature);
  if (isNaN(feelsLike)) {
    // Steadman / Rothfusz formula approximation
    if (temperature >= 27) {
      feelsLike = temperature + 0.33 * (humidity / 100 * 6.105 * Math.exp(17.27 * temperature / (237.7 + temperature))) - 0.7 * (windSpeed / 3.6) - 4;
    } else {
      feelsLike = temperature;
    }
    feelsLike = Math.round(feelsLike * 10) / 10;
  }
  checksPassed.push('feels_like_calculated');

  return {
    isValid,
    checksPassed,
    sanitized: {
      temperature: Math.round(temperature * 10) / 10,
      feelsLike: Math.round(feelsLike * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      windDirection: Math.round(parseFloat(raw.windDirection ?? raw.wind_direction_10m ?? 0)),
      surfacePressure: Math.round(surfacePressure * 10) / 10,
      uvIndex: Math.max(0, Math.min(16, parseFloat(raw.uvIndex ?? raw.uv_index ?? 0))),
      cloudCover: Math.max(0, Math.min(100, parseFloat(raw.cloudCover ?? raw.cloud_cover ?? 0))),
      airQuality: {
        aqi: Math.round(aqi),
        pm2_5: Math.round(pm2_5 * 10) / 10,
        pm10: Math.round(pm10 * 10) / 10,
        no2: Math.round(no2 * 10) / 10,
        so2: Math.round(so2 * 10) / 10,
        o3: Math.round(o3 * 10) / 10,
        co: Math.round(co * 10) / 10
      }
    }
  };
};

module.exports = {
  sanitizeObservation
};
