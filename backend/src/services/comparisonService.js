const storageManager = require('./storageManager');

class ComparisonService {
  async compareRegions(regionIdentifiers = []) {
    if (!regionIdentifiers || regionIdentifiers.length === 0) {
      // Default to the signature trio: Bhimavaram, Vijayawada, Visakhapatnam
      regionIdentifiers = ['IN-AP-BVM', 'IN-AP-VJA', 'IN-AP-VSP'];
    }

    const comparisonList = [];

    for (const id of regionIdentifiers) {
      const region = await storageManager.getRegionByCodeOrId(id);
      if (!region) continue;

      const latestObs = await storageManager.getLatestObservation(region.code);
      const latestIndex = await storageManager.getLatestIndex(region.code);
      const history = await storageManager.getHistoricalObservations(region.code, 48);

      const temps = history.map(h => h.temperature ?? h.weather?.temperature).filter(t => t !== undefined);
      const avgTemp = temps.length > 0 ? Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10 : null;

      const w = latestObs?.weather || {};
      const a = latestObs?.airQuality || {};

      comparisonList.push({
        region: {
          code: region.code,
          name: region.name,
          district: region.district,
          state: region.state,
          coordinates: region.coordinates,
          climateZone: region.climateZone
        },
        current: {
          temperature: w.temperature ?? null,
          feelsLike: w.feelsLike ?? null,
          humidity: w.humidity ?? null,
          rainfall: w.rainfall ?? 0,
          windSpeed: w.windSpeed ?? 0,
          aqi: a.aqi ?? null,
          pm2_5: a.pm2_5 ?? null,
          timestamp: latestObs?.timestamp || null,
          provider: latestObs?.source?.provider || 'UNKNOWN',
          isEstimated: latestObs?.source?.isEstimated || false
        },
        historicalBaseline: {
          avgTemperature48h: avgTemp,
          sampleCount: history.length
        },
        environmentalIndex: {
          score: latestIndex?.overallIndex ?? null,
          rating: latestIndex?.rating ?? 'UNKNOWN',
          subScores: latestIndex?.subScores || null
        },
        radarProfile: {
          temperatureScore: latestIndex?.subScores?.temperatureComfort ?? 70,
          rainfallScore: latestIndex?.subScores?.precipitationBalance ?? 75,
          humidityScore: latestIndex?.subScores?.humidityStability ?? 70,
          airQualityScore: latestIndex?.subScores?.airQualityIndexScore ?? 75
        }
      });
    }

    return {
      regionsCompared: comparisonList.length,
      timestamp: new Date(),
      data: comparisonList
    };
  }
}

module.exports = new ComparisonService();
