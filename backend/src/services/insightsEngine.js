/**
 * PRITHVI-X Natural Language Environmental Insights Engine
 * Translates telemetry and statistical comparisons into grounded, scientifically defensible statements.
 */

const generateInsights = (currentObs, historicalSeries = [], region, indexResult) => {
  const insights = [];
  if (!currentObs || !currentObs.weather) return insights;

  const w = currentObs.weather;
  const a = currentObs.airQuality;
  const regionName = region?.name || 'Selected Region';

  // 1. Temperature Analysis vs Baseline
  if (historicalSeries && historicalSeries.length > 0) {
    const temps = historicalSeries.map(h => h.temperature ?? h.weather?.temperature).filter(t => t !== undefined);
    if (temps.length > 0) {
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const delta = Math.round((w.temperature - avgTemp) * 10) / 10;
      if (Math.abs(delta) >= 1.5) {
        const signWord = delta > 0 ? 'above' : 'below';
        insights.push({
          category: 'temperature',
          title: `Thermal Variation`,
          content: `Current temperature in ${regionName} (${w.temperature}°C) is approximately ${Math.abs(delta)}°C ${signWord} the recent regional baseline average (${Math.round(avgTemp * 10) / 10}°C).`,
          impact: delta > 3 ? 'warning' : 'info'
        });
      } else {
        insights.push({
          category: 'temperature',
          title: `Stable Thermal Profile`,
          content: `Temperature in ${regionName} (${w.temperature}°C) aligns closely with the regional baseline (${Math.round(avgTemp * 10) / 10}°C).`,
          impact: 'neutral'
        });
      }
    }
  }

  // 2. Precipitation & Humidity Dynamics
  if (w.rainfall > 0) {
    insights.push({
      category: 'precipitation',
      title: `Active Precipitation`,
      content: `Recorded rainfall is ${w.rainfall} mm/hr with ${w.humidity}% relative humidity, contributing to positive moisture recharge in the local basin.`,
      impact: w.rainfall > 25 ? 'warning' : 'info'
    });
  } else if (w.humidity >= 80) {
    insights.push({
      category: 'humidity',
      title: `Elevated Atmospheric Humidity`,
      content: `Relative humidity is elevated at ${w.humidity}%, causing apparent temperature (feels like: ${w.feelsLike}°C) to diverge from ambient air temperature.`,
      impact: 'info'
    });
  }

  // 3. Air Quality Assessment
  if (a && a.aqi) {
    let aqiStatus = 'within clean, satisfactory thresholds';
    let impact = 'positive';
    if (a.aqi > 150) {
      aqiStatus = 'in the unhealthy range, primarily influenced by particulate matter (PM2.5: ' + a.pm2_5 + ' µg/m³)';
      impact = 'negative';
    } else if (a.aqi > 100) {
      aqiStatus = 'in the moderate-to-sensitive bracket (PM2.5: ' + a.pm2_5 + ' µg/m³)';
      impact = 'warning';
    }
    insights.push({
      category: 'air_quality',
      title: `Atmospheric Quality Condition`,
      content: `Regional Air Quality Index is currently ${a.aqi}, which sits ${aqiStatus}.`,
      impact
    });
  }

  // 4. PRITHVI-X Environmental Index Synthesized Insight
  if (indexResult) {
    const factorLabels = {
      temperatureComfort: 'temperature divergence',
      precipitationBalance: 'precipitation anomaly',
      humidityStability: 'humidity extremes',
      airQualityIndexScore: 'elevated particulate concentration'
    };
    const limiting = factorLabels[indexResult.keyLimitingFactor] || 'environmental indicators';
    insights.push({
      category: 'overall_index',
      title: `Digital Twin Index Assessment`,
      content: `PRITHVI-X Environmental Index stands at ${indexResult.overallIndex}/100 (${indexResult.rating}). Primary pressure is currently exerted by ${limiting}.`,
      impact: indexResult.overallIndex >= 70 ? 'positive' : (indexResult.overallIndex >= 50 ? 'info' : 'warning')
    });
  }

  return insights;
};

module.exports = {
  generateInsights
};
