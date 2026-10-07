const storageManager = require('../services/storageManager');
const analyticsBridge = require('../services/analyticsBridge');
const ingestionService = require('../services/ingestionService');
const { generateInsights } = require('../services/insightsEngine');
const comparisonService = require('../services/comparisonService');

const getCurrentObservation = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    let latestObs = await storageManager.getLatestObservation(region.code);
    let latestIndex = await storageManager.getLatestIndex(region.code);

    // If observation missing, ingest immediately on demand
    if (!latestObs) {
      const syncResult = await ingestionService.ingestRegion(region.code);
      latestObs = syncResult.observation;
      latestIndex = syncResult.index;
    }

    // Ensure index exists
    if (!latestIndex && latestObs?.weather) {
      latestIndex = await analyticsBridge.calculateIndex(latestObs.weather, latestObs.airQuality);
    }

    res.json({
      success: true,
      data: {
        region: {
          code: region.code,
          name: region.name,
          district: region.district,
          state: region.state,
          coordinates: region.coordinates,
          climateZone: region.climateZone
        },
        observation: latestObs,
        environmentalIndex: latestIndex
      },
      message: `Current environmental telemetry for ${region.name} retrieved successfully.`
    });
  } catch (err) {
    next(err);
  }
};

const getHistoricalObservations = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 168; // default 7 days of hourly
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    const history = await storageManager.getHistoricalObservations(region.code, limit);

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        recordCount: history.length,
        observations: history
      },
      message: `Historical environmental telemetry for ${region.name} (${history.length} records).`
    });
  } catch (err) {
    next(err);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    const history = await storageManager.getHistoricalObservations(region.code, 168);
    const trends = await analyticsBridge.computeTrends(history);

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        trends
      },
      message: `Environmental trends and statistical baseline for ${region.name}.`
    });
  } catch (err) {
    next(err);
  }
};

const getAnomalies = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    const anomalies = await storageManager.getAnomalies(region.code, 20);

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        count: anomalies.length,
        anomalies
      },
      message: `Detected environmental anomalies for ${region.name}.`
    });
  } catch (err) {
    next(err);
  }
};

const getIndex = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    let latestIndex = await storageManager.getLatestIndex(region.code);
    if (!latestIndex) {
      const obs = await storageManager.getLatestObservation(region.code);
      if (obs) {
        latestIndex = await analyticsBridge.calculateIndex(obs.weather, obs.airQuality);
      }
    }

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        environmentalIndex: latestIndex,
        methodology: 'PRITHVI-X Analytical Composite (0-100 Weighted Score across Temp, Rain, Humidity, AQI)'
      },
      message: `PRITHVI-X Environmental Index for ${region.name}.`
    });
  } catch (err) {
    next(err);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    const currentObs = await storageManager.getLatestObservation(region.code);
    const history = await storageManager.getHistoricalObservations(region.code, 72);
    const indexResult = await storageManager.getLatestIndex(region.code);

    const insights = generateInsights(currentObs, history, region, indexResult);

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        insights
      },
      message: `Natural language environmental insights for ${region.name}.`
    });
  } catch (err) {
    next(err);
  }
};

const compareRegions = async (req, res, next) => {
  try {
    let regionIds = [];
    if (req.query.regionIds) {
      regionIds = req.query.regionIds.split(',').map(s => s.trim()).filter(Boolean);
    }
    const result = await comparisonService.compareRegions(regionIds);

    res.json({
      success: true,
      data: result,
      message: `Comparative environmental matrix for ${result.regionsCompared} regions.`
    });
  } catch (err) {
    next(err);
  }
};

const getForecast = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const metric = req.query.metric || 'temperature';
    const horizonHours = parseInt(req.query.horizon, 10) || 24;

    const region = await storageManager.getRegionByCodeOrId(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: { code: 'REGION_NOT_FOUND', message: `Region '${regionId}' not found.` }
      });
    }

    const history = await storageManager.getHistoricalObservations(region.code, 168);
    const forecast = await analyticsBridge.predictTrajectory(history, metric, horizonHours);

    res.json({
      success: true,
      data: {
        regionCode: region.code,
        regionName: region.name,
        forecast
      },
      message: `Environmental predictive trajectory for ${region.name} (${metric}).`
    });
  } catch (err) {
    next(err);
  }
};

const triggerIngest = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const syncResult = await ingestionService.ingestRegion(regionId);

    res.json({
      success: true,
      data: syncResult,
      message: `Ingestion cycle triggered and processed successfully for region ${regionId}.`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentObservation,
  getHistoricalObservations,
  getTrends,
  getAnomalies,
  getIndex,
  getInsights,
  compareRegions,
  getForecast,
  triggerIngest
};
