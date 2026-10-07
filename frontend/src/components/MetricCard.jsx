import React from 'react';

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  badgeText,
  badgeType = 'neutral',
  accentColor = 'var(--emerald-500)'
}) => {
  return (
    <div className="card metric-card" style={{ borderLeft: `3px solid ${accentColor}` }}>
      <div className="metric-card-top">
        <span className="metric-label">{title}</span>
        {badgeText && (
          <span className={`badge badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="metric-value-wrap">
        {Icon && <Icon size={26} style={{ color: accentColor, marginRight: '6px' }} />}
        <span className="metric-value">
          {value !== undefined && value !== null ? value : '--'}
        </span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>

      {subtitle && (
        <div className="metric-footer">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
