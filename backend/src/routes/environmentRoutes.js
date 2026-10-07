const express = require('express');
const router = express.Router();
const {
  getCurrentObservation,
  getHistoricalObservations,
  getTrends,
  getAnomalies,
  getIndex,
  getInsights,
  compareRegions,
  getForecast,
  triggerIngest
} = require('../controllers/environmentController');

router.get('/current/:regionId', getCurrentObservation);
router.get('/history/:regionId', getHistoricalObservations);
router.get('/trends/:regionId', getTrends);
router.get('/anomalies/:regionId', getAnomalies);
router.get('/index/:regionId', getIndex);
router.get('/insights/:regionId', getInsights);
router.get('/compare', compareRegions);
router.get('/forecast/:regionId', getForecast);
router.post('/forecast/:regionId', getForecast);
router.post('/ingest/:regionId', triggerIngest);

module.exports = router;
