import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  icon,
  style,
  className = '',
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'emerald':
        return {
          backgroundColor: 'rgba(5, 150, 105, 0.08)',
          color: 'var(--emerald-verified)',
          border: '1px solid rgba(5, 150, 105, 0.25)',
        };
      case 'cyan':
        return {
          backgroundColor: 'rgba(2, 132, 199, 0.08)',
          color: 'var(--cyan-primary)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
        };
      case 'amber':
        return {
          backgroundColor: 'rgba(217, 119, 6, 0.08)',
          color: 'var(--amber-warning)',
          border: '1px solid rgba(217, 119, 6, 0.25)',
        };
      case 'purple':
        return {
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          color: 'var(--purple-accent)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
        };
      case 'rose':
        return {
          backgroundColor: 'rgba(225, 29, 72, 0.08)',
          color: 'var(--rose-error)',
          border: '1px solid rgba(225, 29, 72, 0.25)',
        };
      case 'slate':
      default:
        return {
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.25rem' : '0.35rem',
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        padding: isSmall ? '0.125rem 0.4rem' : '0.2rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
      className={`kaushal-badge ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
