import React from 'react';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  badge,
  breadcrumbs,
}) => {
  return (
    <div
      style={{
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {breadcrumbs && <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{breadcrumbs}</div>}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text-main)',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>{actions}</div>}
      </div>
      {subtitle && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: '720px',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
