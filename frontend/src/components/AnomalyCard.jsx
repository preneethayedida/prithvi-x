import React from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

export const AnomalyCard = ({ anomaly }) => {
  const { metric, observedValue, baseline, deviation, zScore, severity, explanation, method } = anomaly;

  let badgeClass = 'badge-amber';
  let borderColor = 'var(--amber-500)';

  if (severity === 'SEVERE') {
    badgeClass = 'badge-rose';
    borderColor = 'var(--rose-500)';
  } else if (severity === 'HIGH') {
    badgeClass = 'badge-rose';
    borderColor = '#f43f5e';
  } else if (severity === 'LOW') {
    badgeClass = 'badge-neutral';
    borderColor = 'var(--border-light)';
  }

  const sign = deviation > 0 ? '+' : '';

  return (
    <div 
      className="card" 
      style={{ 
        padding: '16px',
        borderLeft: `3px solid ${borderColor}`,
        marginBottom: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} style={{ color: borderColor }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {metric} Anomaly
          </span>
        </div>
        <span className={`badge ${badgeClass}`}>{severity}</span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
        {explanation}
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '8px', 
        fontSize: '0.75rem',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Observed: </span>
          <strong className="mono" style={{ color: 'var(--text-primary)' }}>{observedValue}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Deviation: </span>
          <strong className="mono" style={{ color: deviation > 0 ? 'var(--rose-400)' : 'var(--cyan-400)' }}>
            {sign}{deviation}
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Z-Score: </span>
          <strong className="mono" style={{ color: 'var(--text-primary)' }}>{zScore ?? 'N/A'}</strong>
        </div>
      </div>
    </div>
  );
};

export default AnomalyCard;
