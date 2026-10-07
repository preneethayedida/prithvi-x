const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeObservation } = require('../src/services/dataSanitizer');
const { calculateEnvironmentalIndex } = require('../src/services/indexCalculator');
const { detectAnomalies } = require('../src/services/anomalyDetector');
const storageManager = require('../src/services/storageManager');
const comparisonService = require('../src/services/comparisonService');

describe('PRITHVI-X Data Sanitizer & Validation Suite', () => {
  test('Sanitizes nominal physical observations correctly', () => {
    const raw = {
      temperature: 31.4,
      humidity: 74,
      rainfall: 2.4,
      windSpeed: 13.2,
      surfacePressure: 1008.5,
      aqi: 68
    };
    const res = sanitizeObservation(raw);
    assert.equal(res.isValid, true);
    assert.equal(res.sanitized.temperature, 31.4);
    assert.equal(res.sanitized.humidity, 74);
    assert.equal(res.sanitized.rainfall, 2.4);
  });

  test('Clamps negative rainfall to 0', () => {
    const raw = { temperature: 28, humidity: 60, rainfall: -15 };
    const res = sanitizeObservation(raw);
    assert.equal(res.sanitized.rainfall, 0);
  });

  test('Rejects impossible temperatures outside [-50, 60]°C', () => {
    const raw = { temperature: 85, humidity: 50 };
    const res = sanitizeObservation(raw);
    assert.equal(res.isValid, false);
  });

  test('Clamps humidity strictly to [0, 100]%', () => {
    const raw = { temperature: 30, humidity: 140 };
    const res = sanitizeObservation(raw);
    assert.equal(res.sanitized.humidity, 100);
  });
});

describe('PRITHVI-X Environmental Index (PEI) Suite', () => {
  test('Calculates balanced PEI score within [0, 100]', () => {
    const weather = { temperature: 25, rainfall: 2.0, humidity: 55 };
    const aqi = { aqi: 45 };
    const index = calculateEnvironmentalIndex(weather, aqi);

    assert.ok(index.overallIndex >= 0 && index.overallIndex <= 100);
    assert.equal(index.rating, 'OPTIMAL');
    assert.ok(index.subScores.temperatureComfort > 90);
  });

  test('Penalizes extreme heat and poor air quality appropriately', () => {
    const weather = { temperature: 44, rainfall: 0, humidity: 85 };
    const aqi = { aqi: 280 };
    const index = calculateEnvironmentalIndex(weather, aqi);

    assert.ok(index.overallIndex < 50);
    assert.ok(['STRESSED', 'CRITICAL'].includes(index.rating));
  });
});

describe('PRITHVI-X Explainable Anomaly Detection Suite', () => {
  test('Flags high temperature deviation exceeding Z >= 2.0', () => {
    const current = {
      regionId: '660000000000000000000001',
      weather: { temperature: 41.5, humidity: 60, rainfall: 0 }
    };
    // Baseline mean ~30°C, std ~1.5°C
    const history = [
      { temperature: 29.5 }, { temperature: 30.0 }, { temperature: 30.5 },
      { temperature: 29.8 }, { temperature: 30.2 }, { temperature: 30.1 }
    ];
    const anomalies = detectAnomalies(current, history, 'IN-AP-BVM');
    assert.ok(anomalies.length > 0);
    assert.equal(anomalies[0].metric, 'temperature');
    assert.ok(anomalies[0].zScore > 2.0);
  });

  test('Returns empty anomalies when all parameters are nominal', () => {
    const current = {
      regionId: '660000000000000000000001',
      weather: { temperature: 30.2, humidity: 60, rainfall: 0 }
    };
    const history = [
      { temperature: 30.0 }, { temperature: 30.2 }, { temperature: 30.1 },
      { temperature: 29.9 }, { temperature: 30.3 }, { temperature: 30.1 }
    ];
    const anomalies = detectAnomalies(current, history, 'IN-AP-BVM');
    assert.equal(anomalies.length, 0);
  });
});

describe('PRITHVI-X Regional Storage & Comparison Suite', () => {
  test('Retrieves initial regional catalog containing Bhimavaram', async () => {
    const regions = await storageManager.getAllRegions();
    assert.ok(regions.length >= 3);
    const bvm = regions.find(r => r.code === 'IN-AP-BVM');
    assert.ok(bvm !== undefined);
    assert.equal(bvm.name, 'Bhimavaram');
  });

  test('Generates multi-region comparative matrix', async () => {
    const comp = await comparisonService.compareRegions(['IN-AP-BVM', 'IN-AP-VJA', 'IN-AP-VSP']);
    assert.equal(comp.regionsCompared, 3);
    assert.ok(comp.data.some(d => d.region.code === 'IN-AP-BVM'));
  });
});
