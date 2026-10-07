import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const TrendChart = ({ data = [], height = 320 }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  const metricConfigs = {
    temperature: {
      name: 'Temperature',
      unit: '°C',
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.2)',
      domain: ['auto', 'auto']
    },
    humidity: {
      name: 'Humidity',
      unit: '%',
      stroke: '#06b6d4',
      fill: 'rgba(6, 182, 212, 0.2)',
      domain: [0, 100]
    },
    rainfall: {
      name: 'Rainfall',
      unit: 'mm',
      stroke: '#3b82f6',
      fill: 'rgba(59, 130, 246, 0.2)',
      domain: [0, 'auto']
    },
    aqi: {
      name: 'Air Quality Index',
      unit: 'AQI',
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.2)',
      domain: [0, 300]
    }
  };

  const currentConfig = metricConfigs[selectedMetric] || metricConfigs.temperature;

  const formattedData = data.map(item => {
    const d = new Date(item.timestamp);
    return {
      ...item,
      timeLabel: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:00`,
      val: item[selectedMetric] ?? item.weather?.[selectedMetric] ?? item.airQuality?.[selectedMetric] ?? 0
    };
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <span className="card-title">Historical Time-Series Analysis</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sequential observations plotted with temporal fidelity
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {Object.keys(metricConfigs).map(key => (
            <button
              key={key}
              className={`btn btn-sm ${selectedMetric === key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedMetric(key)}
            >
              {metricConfigs[key].name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.stroke} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.stroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2c47" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              domain={currentConfig.domain}
              unit={` ${currentConfig.unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1f2c47',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#f8fafc',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
              formatter={(value) => [`${value} ${currentConfig.unit}`, currentConfig.name]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="val"
              stroke={currentConfig.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${selectedMetric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
