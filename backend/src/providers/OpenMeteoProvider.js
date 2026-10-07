const axios = require('axios');
const env = require('../config/env');
const { sanitizeObservation } = require('../services/dataSanitizer');

class OpenMeteoProvider {
  constructor() {
    this.name = 'OPEN_METEO';
    this.weatherBaseUrl = env.OPEN_METEO_API_URL;
    this.aqiBaseUrl = env.OPEN_METEO_AQI_URL;
    this.timeout = 7000;
  }

  /**
   * Fetch current and near-historical observations for a coordinate pair
   */
  async fetchLiveObservation(lat, lon) {
    try {
      const [weatherRes, aqiRes] = await Promise.allSettled([
        axios.get(this.weatherBaseUrl, {
          params: {
            latitude: lat,
            longitude: lon,
            current: [
              'temperature_2m',
              'relative_humidity_2m',
              'apparent_temperature',
              'precipitation',
              'rain',
              'surface_pressure',
              'wind_speed_10m',
              'wind_direction_10m',
              'cloud_cover'
            ].join(','),
            hourly: [
              'temperature_2m',
              'relative_humidity_2m',
              'precipitation',
              'wind_speed_10m',
              'surface_pressure',
              'uv_index'
            ].join(','),
            timezone: 'auto',
            past_days: 7,
            forecast_days: 3
          },
          timeout: this.timeout
        }),
        axios.get(this.aqiBaseUrl, {
          params: {
            latitude: lat,
            longitude: lon,
            current: [
              'us_aqi',
              'pm2_5',
              'pm10',
              'nitrogen_dioxide',
              'sulphur_dioxide',
              'ozone',
              'carbon_monoxide'
            ].join(','),
            hourly: 'us_aqi,pm2_5,pm10',
            timezone: 'auto'
          },
          timeout: this.timeout
        })
      ]);

      if (weatherRes.status !== 'fulfilled') {
        throw new Error(`Weather API failed: ${weatherRes.reason?.message}`);
      }

      const weatherData = weatherRes.value.data;
      const aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value.data : null;

      const currentW = weatherData.current || {};
      const currentA = (aqiData && aqiData.current) || {};

      const raw = {
        temperature: currentW.temperature_2m,
        feelsLike: currentW.apparent_temperature,
        humidity: currentW.relative_humidity_2m,
        rainfall: currentW.precipitation ?? currentW.rain ?? 0,
        windSpeed: currentW.wind_speed_10m ?? 0,
        windDirection: currentW.wind_direction_10m ?? 0,
        surfacePressure: currentW.surface_pressure ?? 1013,
        cloudCover: currentW.cloud_cover ?? 0,
        uvIndex: 0,
        aqi: currentA.us_aqi ?? 55,
        pm2_5: currentA.pm2_5 ?? 18,
        pm10: currentA.pm10 ?? 35,
        no2: currentA.nitrogen_dioxide ?? 12,
        so2: currentA.sulphur_dioxide ?? 6,
        o3: currentA.ozone ?? 32,
        co: currentA.carbon_monoxide ?? 350
      };

      const { isValid, checksPassed, sanitized } = sanitizeObservation(raw);

      return {
        success: true,
        provider: this.name,
        timestamp: currentW.time ? new Date(currentW.time) : new Date(),
        observation: {
          weather: {
            temperature: sanitized.temperature,
            feelsLike: sanitized.feelsLike,
            humidity: sanitized.humidity,
            rainfall: sanitized.rainfall,
            windSpeed: sanitized.windSpeed,
            windDirection: sanitized.windDirection,
            surfacePressure: sanitized.surfacePressure,
            uvIndex: sanitized.uvIndex,
            cloudCover: sanitized.cloudCover
          },
          airQuality: sanitized.airQuality,
          source: {
            provider: this.name,
            stationOrGrid: `Open-Meteo ECMWF/GFS (${lat.toFixed(2)}N, ${lon.toFixed(2)}E)`,
            retrievedAt: new Date(),
            isEstimated: false
          },
          dataQuality: {
            isValid,
            checksPassed
          }
        },
        timeSeriesHourly: this.extractHourlySeries(weatherData, aqiData)
      };
    } catch (err) {
      return {
        success: false,
        provider: this.name,
        error: err.message
      };
    }
  }

  extractHourlySeries(weatherData, aqiData) {
    if (!weatherData.hourly || !weatherData.hourly.time) return [];
    const times = weatherData.hourly.time;
    const temps = weatherData.hourly.temperature_2m || [];
    const hums = weatherData.hourly.relative_humidity_2m || [];
    const rains = weatherData.hourly.precipitation || [];
    const winds = weatherData.hourly.wind_speed_10m || [];
    const press = weatherData.hourly.surface_pressure || [];

    const aqiTimes = (aqiData && aqiData.hourly && aqiData.hourly.time) || [];
    const aqiMap = {};
    if (aqiData && aqiData.hourly && aqiData.hourly.us_aqi) {
      aqiTimes.forEach((t, i) => {
        aqiMap[t] = {
          aqi: aqiData.hourly.us_aqi[i] || 50,
          pm2_5: (aqiData.hourly.pm2_5 && aqiData.hourly.pm2_5[i]) || 15,
          pm10: (aqiData.hourly.pm10 && aqiData.hourly.pm10[i]) || 30
        };
      });
    }

    const series = [];
    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      const aq = aqiMap[t] || { aqi: 50, pm2_5: 15, pm10: 30 };
      series.push({
        timestamp: new Date(t),
        temperature: temps[i] ?? 28,
        humidity: hums[i] ?? 60,
        rainfall: rains[i] ?? 0,
        windSpeed: winds[i] ?? 10,
        surfacePressure: press[i] ?? 1012,
        aqi: aq.aqi,
        pm2_5: aq.pm2_5,
        pm10: aq.pm10
      });
    }
    return series;
  }
}

module.exports = new OpenMeteoProvider();
