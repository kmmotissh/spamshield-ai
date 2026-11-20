import React from 'react';

export default function RiskMeter({ score = 0, level = 'LOW', verdict = '' }) {
  const normScore = Math.min(100, Math.max(0, Math.round(score)));

  let strokeColor = '#10b981'; // Green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  if (normScore >= 85) {
    strokeColor = '#ef4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (normScore >= 60) {
    strokeColor = '#f97316'; // Orange
    glowColor = 'rgba(249, 115, 22, 0.4)';
  } else if (normScore >= 30) {
    strokeColor = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  // Semi-circle SVG gauge calculation
  const radius = 64;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (normScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
      <div style={{ position: 'relative', width: '160px', height: '90px' }}>
        <svg viewBox="0 0 160 90" width="160" height="90">
          {/* Background Track */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Filled Arc */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: strokeColor }}>
            {normScore}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-4px' }}>
            Threat Index
          </span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: strokeColor }}>
          {verdict || `${level} RISK`}
        </div>
      </div>
    </div>
  );
}
