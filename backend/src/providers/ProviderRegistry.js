const openMeteoProvider = require('./OpenMeteoProvider');
const seedFallbackProvider = require('./SeedFallbackProvider');
const env = require('../config/env');

class ProviderRegistry {
  constructor() {
    this.primary = openMeteoProvider;
    this.fallback = seedFallbackProvider;
  }

  async getObservation(region) {
    const lat = region.coordinates?.latitude;
    const lon = region.coordinates?.longitude;
    const code = region.code;

    // 1. Attempt Primary Live Provider
    if (lat !== undefined && lon !== undefined) {
      const result = await this.primary.fetchLiveObservation(lat, lon);
      if (result.success && result.observation) {
        return {
          ...result.observation,
          regionId: region._id,
          regionCode: code,
          timestamp: result.timestamp
        };
      }
      console.warn(`[ProviderRegistry] Primary provider ${this.primary.name} failed for ${code}: ${result.error || 'Unknown error'}`);
    }

    // 2. Safe Fallback
    if (env.USE_FALLBACK_IF_API_FAILS) {
      console.info(`[ProviderRegistry] Engaging fallback provider for region ${code}`);
      const fallbackObs = this.fallback.generateObservation(code, new Date());
      return {
        ...fallbackObs,
        regionId: region._id,
        regionCode: code,
        timestamp: new Date()
      };
    }

    throw new Error(`Data provider failed and fallback is disabled for region ${code}`);
  }

  async getHistoricalSeries(region, days = 14) {
    const lat = region.coordinates?.latitude;
    const lon = region.coordinates?.longitude;
    const code = region.code;

    if (lat !== undefined && lon !== undefined) {
      const result = await this.primary.fetchLiveObservation(lat, lon);
      if (result.success && result.timeSeriesHourly && result.timeSeriesHourly.length > 0) {
        return result.timeSeriesHourly.map(item => ({
          ...item,
          regionId: region._id,
          regionCode: code,
          source: {
            provider: this.primary.name,
            stationOrGrid: `Open-Meteo Grid (${lat}N, ${lon}E)`,
            retrievedAt: new Date(),
            isEstimated: false
          }
        }));
      }
    }

    // Climatological series
    return this.fallback.generateHistoricalSeries(code, days).map(item => ({
      ...item,
      regionId: region._id,
      regionCode: code
    }));
  }
}

module.exports = new ProviderRegistry();
