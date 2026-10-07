import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const IndexGauge = ({ indexData }) => {
  if (!indexData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Calculating Environmental Index...</p>
      </div>
    );
  }

  const score = indexData.overallIndex ?? 75;
  const rating = indexData.rating ?? 'GOOD';
  const sub = indexData.subScores || {
    temperatureComfort: 75,
    precipitationBalance: 80,
    humidityStability: 70,
    airQualityIndexScore: 75
  };

  // Color logic
  let color = 'var(--emerald-500)';
  let badgeClass = 'badge-emerald';
  if (score < 40) {
    color = 'var(--rose-500)';
    badgeClass = 'badge-rose';
  } else if (score < 70) {
    color = 'var(--amber-500)';
    badgeClass = 'badge-amber';
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <ShieldCheck size={18} style={{ color }} />
          PRITHVI-X Environmental Index (PEI)
        </span>
        <span className={`badge ${badgeClass}`}>{rating}</span>
      </div>

      <div className="pei-gauge-container">
        <div 
          className="pei-score-ring"
          style={{ borderColor: color }}
        >
          <span className="pei-score-number" style={{ color }}>{score}</span>
          <span className="pei-score-scale">/ 100</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          Multivariate Weighted Composite Index
        </p>
      </div>

      {/* Sub-Score Breakdowns */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Thermal Comfort (Weight: 25%)</span>
            <span className="mono" style={{ fontWeight: 600 }}>{sub.temperatureComfort}/100</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${sub.temperatureComfort}%`, height: '100%', background: 'var(--emerald-500)', borderRadius: '3px' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Precipitation Balance (Weight: 25%)</span>
            <span className="mono" style={{ fontWeight: 600 }}>{sub.precipitationBalance}/100</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${sub.precipitationBalance}%`, height: '100%', background: 'var(--cyan-500)', borderRadius: '3px' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Humidity Stability (Weight: 20%)</span>
            <span className="mono" style={{ fontWeight: 600 }}>{sub.humidityStability}/100</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${sub.humidityStability}%`, height: '100%', background: 'var(--amber-500)', borderRadius: '3px' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Air Purity Index (Weight: 30%)</span>
            <span className="mono" style={{ fontWeight: 600 }}>{sub.airQualityIndexScore}/100</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${sub.airQualityIndexScore}%`, height: '100%', background: '#818cf8', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '10px 14px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={14} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
        <span>Limiting factor: <strong style={{ color: 'var(--text-primary)' }}>{indexData.keyLimitingFactor || 'None'}</strong></span>
      </div>
    </div>
  );
};

export default IndexGauge;
