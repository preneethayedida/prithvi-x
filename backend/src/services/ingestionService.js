const storageManager = require('./storageManager');
const providerRegistry = require('../providers/ProviderRegistry');
const analyticsBridge = require('./analyticsBridge');

class IngestionService {
  async ingestRegion(regionIdentifier) {
    const region = await storageManager.getRegionByCodeOrId(regionIdentifier);
    if (!region) {
      throw new Error(`Region ${regionIdentifier} not found in database.`);
    }

    // 1. Fetch observation from provider
    const observation = await providerRegistry.getObservation(region);

    // 2. Persist observation
    const savedObs = await storageManager.saveObservation(observation);

    // 3. Fetch recent history for analytical baseline
    const history = await storageManager.getHistoricalObservations(region.code, 72);

    // 4. Compute Environmental Index
    const indexData = await analyticsBridge.calculateIndex(
      observation.weather,
      observation.airQuality
    );
    const savedIndex = await storageManager.saveIndex({
      ...indexData,
      regionId: region._id,
      regionCode: region.code,
      timestamp: observation.timestamp || new Date()
    });

    // 5. Detect Anomalies
    const detectedAnomalies = await analyticsBridge.detectAnomalies(
      observation,
      history,
      region.code
    );
    for (const anom of detectedAnomalies) {
      await storageManager.saveAnomaly(anom);
    }

    return {
      observation: savedObs,
      index: savedIndex,
      anomalies: detectedAnomalies
    };
  }

  async seedHistoricalDataIfEmpty() {
    const regions = await storageManager.getAllRegions();
    console.log(`[IngestionService] Auditing environmental time-series for ${regions.length} regions...`);

    for (const r of regions) {
      const existing = await storageManager.getHistoricalObservations(r.code, 5);
      if (existing.length < 5) {
        console.log(`[IngestionService] Seeding benchmark time-series history for ${r.name} (${r.code})...`);
        const series = await providerRegistry.getHistoricalSeries(r, 14); // 14 days
        for (const item of series) {
          await storageManager.saveObservation(item);
        }
        // Ingest current observation and run analytics
        await this.ingestRegion(r.code);
      }
    }
    console.log(`[IngestionService] Time-series initialization audit complete.`);
  }

  async ingestAll() {
    const regions = await storageManager.getAllRegions();
    console.log(`[IngestionService] Triggering scheduled sync for ${regions.length} regions...`);
    const results = [];
    for (const r of regions) {
      try {
        const res = await this.ingestRegion(r.code);
        results.push({ region: r.code, success: true });
      } catch (err) {
        results.push({ region: r.code, success: false, error: err.message });
      }
    }
    return results;
  }
}

module.exports = new IngestionService();
