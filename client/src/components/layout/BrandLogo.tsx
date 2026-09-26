import React from 'react';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  tagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 28,
  showWordmark = true,
  tagline = false,
  className = '',
}) => {
  return (
    <div
      className={`brand-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* Kaushal Distinctive Geometric Proof Symbol */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="kaushalGradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Shield */}
        <polygon
          points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5"
          stroke="url(#kaushalGradient)"
          strokeWidth="2.2"
          fill="rgba(2, 132, 199, 0.06)"
          strokeLinejoin="round"
        />

        {/* Inner Topological Proof Rays */}
        <path
          d="M16,3 L16,16 M28,9.5 L16,16 M4,9.5 L16,16"
          stroke="url(#kaushalGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        <path
          d="M16,16 L16,29 M16,16 L28,22.5 M16,16 L4,22.5"
          stroke="url(#kaushalGradient)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />

        {/* Central Proof Verification Core */}
        <circle cx="16" cy="16" r="3.2" fill="#0284c7" />
        <circle cx="16" cy="16" r="1.4" fill="#ffffff" />

        {/* Verification Nodes */}
        <circle cx="16" cy="3" r="1.8" fill="#0284c7" />
        <circle cx="28" cy="9.5" r="1.8" fill="#0369a1" />
        <circle cx="4" cy="9.5" r="1.8" fill="#059669" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: size >= 32 ? '1.35rem' : '1.125rem',
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                lineHeight: 1,
              }}
            >
              Kaushal
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--emerald-verified)',
                background: 'rgba(5, 150, 105, 0.08)',
                padding: '0.1rem 0.35rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(5, 150, 105, 0.25)',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              PROVED
            </span>
          </div>

          {tagline && (
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.01em',
                marginTop: '0.15rem',
                fontWeight: 500,
              }}
            >
              Don't claim your skills. Prove them.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
