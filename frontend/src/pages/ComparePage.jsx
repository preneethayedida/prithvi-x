import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  MapPin, 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { useRegion } from '../context/RegionContext';
import EnvironmentalAPI from '../services/api';

export const ComparePage = () => {
  const { regions } = useRegion();
  // Default to Bhimavaram, Vijayawada, Visakhapatnam
  const [selectedCodes, setSelectedCodes] = useState(['IN-AP-BVM', 'IN-AP-VJA', 'IN-AP-VSP']);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await EnvironmentalAPI.compareRegions(selectedCodes);
        if (res.success && res.data?.data) {
          setComparisonData(res.data.data);
        }
      } catch (err) {
        console.error('[Comparison Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCodes.length > 0) {
      fetchComparison();
    }
  }, [selectedCodes]);

  const toggleRegion = (code) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter(c => c !== code));
      }
    } else {
      if (selectedCodes.length < 5) {
        setSelectedCodes([...selectedCodes, code]);
      }
    }
  };

  // Prepare radar multi-axis data
  const radarAxes = [
    { metric: 'Thermal Comfort', key: 'temperatureScore' },
    { metric: 'Precipitation', key: 'rainfallScore' },
    { metric: 'Humidity Stability', key: 'humidityScore' },
    { metric: 'Air Quality Purity', key: 'airQualityScore' }
  ];

  const radarData = radarAxes.map(axis => {
    const item = { subject: axis.metric };
    comparisonData.forEach(cd => {
      item[cd.region.name] = cd.radarProfile?.[axis.key] ?? 70;
    });
    return item;
  });

  const radarColors = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>
          Multi-Region Environmental Comparison
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Cross-regional benchmarking of atmospheric telemetry, digital twin indices, and environmental profiles
        </p>
      </div>

      {/* Region Selector Filter Pills */}
      <div className="card" style={{ padding: '16px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
          Select Regions to Compare (Select 2 to 5 regions):
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {regions.map(r => {
            const isSelected = selectedCodes.includes(r.code);
            return (
              <button
                key={r.code}
                onClick={() => toggleRegion(r.code)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', gap: '6px' }}
              >
                {isSelected && <Check size={13} />}
                <span>{r.name} ({r.district})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header">
          <span className="card-title">
            <GitCompare size={16} />
            Environmental Matrix Comparison Table
          </span>
          <span className="badge badge-cyan">{comparisonData.length} Regions Active</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Region & District</th>
              <th style={{ padding: '12px 16px' }}>PEI Score</th>
              <th style={{ padding: '12px 16px' }}>Temperature</th>
              <th style={{ padding: '12px 16px' }}>Humidity</th>
              <th style={{ padding: '12px 16px' }}>Precipitation</th>
              <th style={{ padding: '12px 16px' }}>Air Quality</th>
              <th style={{ padding: '12px 16px' }}>Data Provenance</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map(cd => (
              <tr key={cd.region.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{cd.region.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cd.region.district}, {cd.region.state}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-emerald mono" style={{ fontSize: '0.8rem' }}>
                    {cd.environmentalIndex.score}/100 ({cd.environmentalIndex.rating})
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="mono" style={{ fontWeight: 600 }}>{cd.current.temperature}°C</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Feels: {cd.current.feelsLike}°C
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="mono">{cd.current.humidity}%</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="mono" style={{ color: '#38bdf8' }}>{cd.current.rainfall} mm</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="mono" style={{ color: 'var(--amber-400)' }}>{cd.current.aqi} AQI</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    PM2.5: {cd.current.pm2_5}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${cd.current.isEstimated ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                    {cd.current.provider}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Comparison: Radar & Bar Charts */}
      <div className="grid-2">
        {/* Radar Profile */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <ShieldCheck size={16} style={{ color: 'var(--emerald-400)' }} />
              Environmental Balance Radar Profile
            </span>
          </div>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2c47" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2c47', borderRadius: '8px', fontSize: '0.8rem' }}
                />
                <Legend />
                {comparisonData.map((cd, index) => (
                  <Radar
                    key={cd.region.code}
                    name={cd.region.name}
                    dataKey={cd.region.name}
                    stroke={radarColors[index % radarColors.length]}
                    fill={radarColors[index % radarColors.length]}
                    fillOpacity={0.25}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Environmental Index Comparison */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Thermometer size={16} style={{ color: 'var(--cyan-400)' }} />
              PRITHVI-X Index & Temperature Comparison
            </span>
          </div>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={comparisonData.map(cd => ({
                  name: cd.region.name,
                  PEI: cd.environmentalIndex.score,
                  Temperature: cd.current.temperature
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2c47" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2c47', borderRadius: '8px', fontSize: '0.8rem' }}
                />
                <Legend />
                <Bar dataKey="PEI" fill="#10b981" radius={[4, 4, 0, 0]} name="PEI Score (0-100)" />
                <Bar dataKey="Temperature" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Temperature (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
