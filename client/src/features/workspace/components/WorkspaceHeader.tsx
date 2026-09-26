import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface WorkspaceHeaderProps {
  challenge: any;
  submission: any;
  saving: boolean;
  bannerMsg: { type: 'success' | 'error'; text: string } | null;
  onFinalize: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  challenge,
  submission,
  saving,
  bannerMsg,
  onFinalize,
}) => {
  const preflight = submission?.preflightChecks || {};
  const isFinalized = submission?.status === 'UNDER_REVIEW' || submission?.status === 'VERIFIED';

  return (
    <div>
      {/* Banner message if any */}
      {bannerMsg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: bannerMsg.type === 'success' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(225, 29, 72, 0.08)',
            color: bannerMsg.type === 'success' ? 'var(--emerald-verified)' : 'var(--rose-error)',
            border: `1px solid ${bannerMsg.type === 'success' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(225, 29, 72, 0.25)'}`,
          }}
        >
          {bannerMsg.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span>{bannerMsg.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Badge variant="cyan">{challenge?.domain || 'DISTRIBUTED_SYSTEMS'}</Badge>
            <Badge variant="purple">{challenge?.difficulty || 'ADVANCED'} TIER</Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SHA: {submission?.commitSha?.substring(0, 8) || '4f19b2c8'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {challenge?.title || 'Engineering Workspace'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isFinalized ? (
            <Badge variant="emerald" size="md">
              <CheckCircle2 size={14} />
              <span>SUBMISSION UNDER REVIEW</span>
            </Badge>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onFinalize}
              isLoading={saving}
              rightIcon={<ArrowRight size={15} />}
            >
              Finalize & Queue for Review
            </Button>
          )}
        </div>
      </div>

      {/* Preflight Checklist Bar */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          PREFLIGHT VERIFICATION CRITERIA:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <CheckCircle2 size={14} color={preflight.repoValid ? 'var(--emerald-verified)' : 'var(--text-muted)'} />
            <span>Repository Hash</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <CheckCircle2 size={14} color={preflight.architectureValid ? 'var(--emerald-verified)' : 'var(--text-muted)'} />
            <span>Architecture Overview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <CheckCircle2 size={14} color={preflight.adrValid ? 'var(--emerald-verified)' : 'var(--text-muted)'} />
            <span>Accepted ADRs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <CheckCircle2 size={14} color={preflight.testsValid ? 'var(--emerald-verified)' : 'var(--text-muted)'} />
            <span>Container Benchmarks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <CheckCircle2 size={14} color={preflight.explanationValid ? 'var(--emerald-verified)' : 'var(--text-muted)'} />
            <span>Technical Explanation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
