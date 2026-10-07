import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind, 
  RefreshCw, 
  MapPin, 
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import EnvironmentalAPI from '../services/api';
import MetricCard from '../components/MetricCard';
import IndexGauge from '../components/IndexGauge';
import InsightCard from '../components/InsightCard';
import AnomalyCard from '../components/AnomalyCard';
import DataSourceBadge from '../components/DataSourceBadge';
import TrendChart from '../components/TrendChart';

export const DashboardPage = () => {
  const { selectedRegion, regions } = useRegion();
  const [telemetry, setTelemetry] = useState(null);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboardData = async (regionId) => {
    if (!regionId) return;
    try {
      setLoading(true);
      setError(null);

      const [obsRes, insRes, anomRes, histRes] = await Promise.allSettled([
        EnvironmentalAPI.getCurrentObservation(regionId),
        EnvironmentalAPI.getInsights(regionId),
        EnvironmentalAPI.getAnomalies(regionId),
        EnvironmentalAPI.getHistory(regionId, 48)
      ]);

      if (obsRes.status === 'fulfilled' && obsRes.value?.data) {
        setTelemetry(obsRes.value.data);
      } else {
        throw new Error('Unable to retrieve current regional observation.');
      }

      if (insRes.status === 'fulfilled' && insRes.value?.data?.insights) {
        setInsights(insRes.value.data.insights);
      }

      if (anomRes.status === 'fulfilled' && anomRes.value?.data?.anomalies) {
        setAnomalies(anomRes.value.data.anomalies);
      }

      if (histRes.status === 'fulfilled' && histRes.value?.data?.observations) {
        setHistory(histRes.value.data.observations);
      }
    } catch (err) {
      console.error('[Dashboard Load Error]', err);
      setError(err.message || 'Failed to load telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRegion?.code) {
      loadDashboardData(selectedRegion.code);
    }
  }, [selectedRegion?.code]);

  const handleManualSync = async () => {
    if (!selectedRegion?.code || syncing) return;
    try {
      setSyncing(true);
      await EnvironmentalAPI.triggerIngest(selectedRegion.code);
      await loadDashboardData(selectedRegion.code);
    } catch (err) {
      console.error('[Sync Error]', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading && !telemetry) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} className="spin" style={{ marginBottom: '12px', color: 'var(--emerald-500)' }} />
        <p>Loading digital twin environmental telemetry...</p>
      </div>
    );
  }

  const weather = telemetry?.observation?.weather || {};
  const airQuality = telemetry?.observation?.airQuality || {};
  const envIndex = telemetry?.environmentalIndex;
  const source = telemetry?.observation?.source;
  const obsTime = telemetry?.observation?.timestamp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Context Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={20} style={{ color: 'var(--emerald-400)' }} />
            <h1 style={{ fontSize: '1.75rem' }}>{selectedRegion?.name}</h1>
            <span className="badge badge-neutral">{selectedRegion?.district}, {selectedRegion?.state}</span>
            <span className="badge badge-emerald">{selectedRegion?.climateZone}</span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <DataSourceBadge source={source} timestamp={obsTime} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleManualSync}
            disabled={syncing}
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={syncing ? 'spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderLeft: '4px solid var(--rose-500)', color: 'var(--rose-400)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid-4">
        <MetricCard
          title="Ambient Temperature"
          value={weather.temperature}
          unit="°C"
          icon={Thermometer}
          accentColor="#10b981"
          subtitle={`Apparent (Feels like): ${weather.feelsLike ?? weather.temperature}°C`}
          badgeText={weather.temperature > 35 ? 'Warm' : 'Normal'}
          badgeType={weather.temperature > 35 ? 'amber' : 'emerald'}
        />

        <MetricCard
          title="Relative Humidity"
          value={weather.humidity}
          unit="%"
          icon={Droplets}
          accentColor="#06b6d4"
          subtitle={`Surface Pressure: ${weather.surfacePressure} hPa`}
          badgeText={weather.humidity > 75 ? 'Humid' : 'Stable'}
          badgeType={weather.humidity > 75 ? 'cyan' : 'neutral'}
        />

        <MetricCard
          title="Precipitation Rate"
          value={weather.rainfall}
          unit="mm"
          icon={CloudRain}
          accentColor="#3b82f6"
          subtitle={weather.rainfall > 0 ? 'Active Precipitation' : 'Zero Precipitation'}
          badgeText={weather.rainfall > 0 ? 'Active' : 'Dry'}
          badgeType={weather.rainfall > 0 ? 'cyan' : 'neutral'}
        />

        <MetricCard
          title="Air Quality (US AQI)"
          value={airQuality.aqi}
          unit="AQI"
          icon={Wind}
          accentColor="#f59e0b"
          subtitle={`PM2.5: ${airQuality.pm2_5} µg/m³ • PM10: ${airQuality.pm10} µg/m³`}
          badgeText={airQuality.aqi <= 50 ? 'Good' : (airQuality.aqi <= 100 ? 'Moderate' : 'Elevated')}
          badgeType={airQuality.aqi <= 50 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Central 2-Column: PEI Gauge & Natural Language Insights */}
      <div className="grid-2">
        <IndexGauge indexData={envIndex} />

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Sparkles size={16} style={{ color: 'var(--cyan-400)' }} />
              Environmental Intelligence Insights
            </span>
            <span className="badge badge-cyan">{insights.length} Synthesized</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.length > 0 ? (
              insights.map((ins, i) => <InsightCard key={i} insight={ins} />)
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Analyzing current baseline to generate environmental conclusions...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <TrendChart data={history} height={300} />

      {/* Anomaly Detection Center */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <AlertTriangle size={16} style={{ color: 'var(--amber-400)' }} />
            Statistical Anomaly Detection Center
          </span>
          <span className="badge badge-neutral">{anomalies.length} Flagged</span>
        </div>

        {anomalies.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
            {anomalies.map((anom, idx) => (
              <AnomalyCard key={idx} anomaly={anom} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>✓ All parameters nominal.</span> No statistical anomalies exceed the $|Z| \ge 2.0$ or IQR thresholds for this observation interval.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
