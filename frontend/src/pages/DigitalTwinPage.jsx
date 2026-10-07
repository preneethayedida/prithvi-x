import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  MapPin, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind, 
  ShieldCheck, 
  Activity,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';
import EnvironmentalAPI from '../services/api';
import MapView from '../components/MapView';
import DataSourceBadge from '../components/DataSourceBadge';

export const DigitalTwinPage = () => {
  const { regions, selectedRegion, setSelectedRegion } = useRegion();
  const [activeLayer, setActiveLayer] = useState('pei');
  const [searchQuery, setSearchQuery] = useState('');
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegionTelemetry = async () => {
      if (!selectedRegion?.code) return;
      try {
        setLoading(true);
        const res = await EnvironmentalAPI.getCurrentObservation(selectedRegion.code);
        if (res.success && res.data) {
          setTelemetry(res.data);
        }
      } catch (err) {
        console.error('[Digital Twin Telemetry Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionTelemetry();
  }, [selectedRegion?.code]);

  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const weather = telemetry?.observation?.weather || {
    temperature: 31.4,
    humidity: 74,
    rainfall: 2.4,
    windSpeed: 13.2,
    feelsLike: 35.8
  };
  const airQuality = telemetry?.observation?.airQuality || { aqi: 68, pm2_5: 20.4 };
  const envIndex = telemetry?.environmentalIndex?.overallIndex ?? 78;
  const rating = telemetry?.environmentalIndex?.rating ?? 'GOOD';

  return (
    <div style={{ position: 'relative' }}>
      {/* Control Strip */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} style={{ color: 'var(--emerald-400)' }} />
            Regional Digital Twin Canvas
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time geospatial twin with coordinate-level telemetry mapping
          </p>
        </div>

        {/* Search & Quick Region Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search region or district..."
              className="input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', width: '100%', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {filteredRegions.slice(0, 4).map(r => (
              <button
                key={r.code}
                onClick={() => setSelectedRegion(r.code)}
                className={`btn btn-sm ${selectedRegion?.code === r.code ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <MapView
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        onSelectRegion={(reg) => setSelectedRegion(reg.code)}
      />

      {/* Floating Regional Profile Drawer */}
      {selectedRegion && (
        <div className="telemetry-drawer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} style={{ color: 'var(--emerald-400)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>{selectedRegion.name}</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedRegion.district}, {selectedRegion.state}
              </p>
            </div>
            <span className="badge badge-emerald">
              PEI {envIndex}/100
            </span>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>
              <span className="mono">{selectedRegion.coordinates?.latitude}°N, {selectedRegion.coordinates?.longitude}°E</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Climate Zone:</span>
              <span>{selectedRegion.climateZone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Elevation:</span>
              <span className="mono">{selectedRegion.coordinates?.elevation ?? 10} m MSL</span>
            </div>
          </div>

          {/* Environmental Telemetry Profile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div className="card" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temperature</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--emerald-400)' }}>
                {weather.temperature}°C
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Feels: {weather.feelsLike}°C</span>
            </div>

            <div className="card" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Humidity</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan-400)' }}>
                {weather.humidity}%
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Relative</span>
            </div>

            <div className="card" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precipitation</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                {weather.rainfall} mm
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hourly</span>
            </div>

            <div className="card" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wind Speed</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>
                {weather.windSpeed} km/h
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10m Surface</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <DataSourceBadge source={telemetry?.observation?.source} timestamp={telemetry?.observation?.timestamp} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link 
              to="/dashboard" 
              className="btn btn-primary" 
              style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
            >
              Open Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '8px 12px' }}
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwinPage;
