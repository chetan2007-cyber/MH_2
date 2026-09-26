import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal, Button, Badge } from '../../../components/ui';

interface WhyScoreModalProps {
  capability?: any | null;
  data?: any | null;
  onClose: () => void;
  onNavigate?: (view: string, extra?: any) => void;
}

export const WhyScoreModal: React.FC<WhyScoreModalProps> = ({ capability: capabilityProp, data, onClose, onNavigate }) => {
  const capability = capabilityProp ?? data;
  if (!capability) return null;

  return (
    <Modal
      isOpen={Boolean(capability)}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="cyan">{capability.displayName}</Badge>
          <span>Why {capability.score} / 100?</span>
        </div>
      }
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onNavigate?.('proofgraph');
            }}
            rightIcon={<ArrowRight size={14} />}
          >
            Inspect in ProofGraph™
          </Button>
        </>
      }
    >
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
        Every capability score on Kaushal is mathematically derived from verified code commits, benchmark latencies, double-blind peer audits, and architectural defense.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {capability.explanation?.summaryPoints?.map((pt: string, idx: number) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
            }}
          >
            <CheckCircle2 size={14} color="var(--emerald-verified)" style={{ flexShrink: 0 }} />
            <span>{pt}</span>
          </div>
        )) || (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
              <CheckCircle2 size={14} color="var(--emerald-verified)" />
              <span style={{ fontSize: '0.75rem' }}>4 verified backend engineering projects</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
              <CheckCircle2 size={14} color="var(--emerald-verified)" />
              <span style={{ fontSize: '0.75rem' }}>100% automated container tests passed (P99 &lt; 5ms)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
              <CheckCircle2 size={14} color="var(--emerald-verified)" />
              <span style={{ fontSize: '0.75rem' }}>4 Architecture Decision Records (ADRs) accepted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
              <CheckCircle2 size={14} color="var(--emerald-verified)" />
              <span style={{ fontSize: '0.75rem' }}>Defense Round™ passed with Strong AST confidence</span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
