import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  style,
  className = '',
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--border-subtle)',
        animation: 'pulseGlow 1.5s infinite ease-in-out',
        ...style,
      }}
      className={`kaushal-skeleton ${className}`}
    />
  );
};
