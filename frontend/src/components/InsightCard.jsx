import React from 'react';
import { Sparkles, ArrowUpRight, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const InsightCard = ({ insight }) => {
  const { title, content, impact } = insight;

  let badgeType = 'badge-neutral';
  let Icon = Info;
  let accentBorder = 'var(--border)';

  if (impact === 'positive') {
    badgeType = 'badge-emerald';
    Icon = CheckCircle2;
    accentBorder = 'var(--emerald-500)';
  } else if (impact === 'warning' || impact === 'negative') {
    badgeType = 'badge-rose';
    Icon = AlertCircle;
    accentBorder = 'var(--rose-500)';
  } else if (impact === 'info') {
    badgeType = 'badge-cyan';
    Icon = Sparkles;
    accentBorder = 'var(--cyan-500)';
  }

  return (
    <div 
      className="card" 
      style={{ 
        padding: '16px',
        borderLeft: `3px solid ${accentBorder}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon size={15} />
          {title}
        </span>
        <span className={`badge ${badgeType}`} style={{ textTransform: 'capitalize' }}>
          {impact || 'Observation'}
        </span>
      </div>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
        {content}
      </p>
    </div>
  );
};

export default InsightCard;
