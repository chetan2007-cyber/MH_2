import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, style, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {leftIcon && (
            <span
              style={{
                position: 'absolute',
                left: '10px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            style={{
              width: '100%',
              padding: leftIcon ? '8px 12px 8px 34px' : rightIcon ? '8px 34px 8px 12px' : '8px 12px',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              color: 'var(--text-main)',
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${error ? 'var(--rose-error)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              ...style,
            }}
            className={`kaushal-input ${className}`}
            {...props}
          />
          {rightIcon && (
            <span
              style={{
                position: 'absolute',
                right: '10px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--rose-error)' }}>{error}</span>
        ) : helperText ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
