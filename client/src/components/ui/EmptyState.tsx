import React from 'react';
import { Inbox, AlertCircle, ArrowRight, RefreshCw, Compass } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Inbox size={36} color="var(--text-muted)" />,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px dashed var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-app)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {icon}
      </div>
      <h4
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '0.35rem',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: '380px',
            marginBottom: action ? '1.5rem' : 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

// Section 28 Empty State Preset
export const NoProjectsEmptyState: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => (
  <EmptyState
    icon={<Compass size={32} color="var(--accent-primary)" />}
    title="No verified projects yet"
    description="Your first proof starts with a challenge."
    action={
      <Button variant="primary" size="sm" onClick={onExplore} rightIcon={<ArrowRight size={14} />}>
        Explore Challenges →
      </Button>
    }
  />
);

// Section 30 Error State Preset
export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({ onRetry, message }) => (
  <EmptyState
    icon={<AlertCircle size={32} color="var(--rose-error)" />}
    title="Something went wrong."
    description={message || "We couldn't load this evidence."}
    action={
      <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw size={14} />}>
        Try Again
      </Button>
    }
  />
);
