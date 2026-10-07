import React from 'react';
import { Database, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DataSourceBadge = ({ source, timestamp }) => {
  if (!source) return null;

  const { provider, stationOrGrid, isEstimated } = source;
  const timeFormatted = timestamp ? new Date(timestamp).toLocaleString() : 'Recent';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '0.78rem',
      color: 'var(--text-muted)',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border)',
      padding: '6px 14px',
      borderRadius: '20px',
      width: 'fit-content'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Database size={13} style={{ color: isEstimated ? 'var(--amber-400)' : 'var(--emerald-400)' }} />
        <span>Provider: <strong style={{ color: 'var(--text-secondary)' }}>{provider}</strong></span>
      </div>

      <span>•</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>Grid: <strong style={{ color: 'var(--text-secondary)' }}>{stationOrGrid}</strong></span>
      </div>

      <span>•</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Clock size={13} />
        <span>{timeFormatted}</span>
      </div>

      {isEstimated ? (
        <span className="badge badge-amber" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
          Climatological Model
        </span>
      ) : (
        <span className="badge badge-emerald" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
          Verified Grid Live
        </span>
      )}
    </div>
  );
};

export default DataSourceBadge;
