import React, { useState } from 'react';
import { CheckCircle2, PauseCircle, XCircle, X } from 'lucide-react';
import { applicationService } from '../../services/application.service';
import { useToast } from '../Toast';
import type { Application } from '../../types/api';

interface FinalDecisionModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onDecisionMade?: (updatedApp: Application) => void;
}

export const FinalDecisionModal: React.FC<FinalDecisionModalProps> = ({
  application,
  isOpen,
  onClose,
  onDecisionMade,
}) => {
  const { showToast } = useToast();
  const [decision, setDecision] = useState<'SELECT' | 'HOLD' | 'REJECT'>('SELECT');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await applicationService.makeFinalDecision(application._id, {
        decision,
        reason: reason.trim() || `HR recorded candidate final status as ${decision}.`,
      });
      showToast('success', 'Final Decision Recorded', `Candidate status updated to ${decision}.`);
      if (onDecisionMade) onDecisionMade(updated);
      onClose();
    } catch (err: any) {
      showToast('error', 'Decision Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          maxWidth: 540,
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
              HR Governance & Final Decision
            </span>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 0' }}>
              Finalize: {application.candidateId?.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
              Select Official Outcome:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDecision('SELECT')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  border: `1.5px solid ${decision === 'SELECT' ? '#059669' : 'var(--border-subtle)'}`,
                  background: decision === 'SELECT' ? '#05966914' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <CheckCircle2 size={20} color={decision === 'SELECT' ? '#059669' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: decision === 'SELECT' ? '#059669' : 'var(--text-main)' }}>
                  SELECT / OFFER
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('HOLD')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  border: `1.5px solid ${decision === 'HOLD' ? '#d97706' : 'var(--border-subtle)'}`,
                  background: decision === 'HOLD' ? '#d9770614' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <PauseCircle size={20} color={decision === 'HOLD' ? '#d97706' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: decision === 'HOLD' ? '#d97706' : 'var(--text-main)' }}>
                  ON HOLD
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECT')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  border: `1.5px solid ${decision === 'REJECT' ? '#dc2626' : 'var(--border-subtle)'}`,
                  background: decision === 'REJECT' ? '#dc262614' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <XCircle size={20} color={decision === 'REJECT' ? '#dc2626' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: decision === 'REJECT' ? '#dc2626' : 'var(--text-main)' }}>
                  REJECT
                </span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
              Decision Memo & Justification (Logged into Audit Record):
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Candidate demonstrated verified architectural mastery in concurrency assessment (score: 94%) and passed live technical defense with distinction."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: decision === 'SELECT' ? '#059669' : decision === 'HOLD' ? '#d97706' : '#dc2626',
                color: '#fff',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {loading ? 'Recording...' : `Record ${decision}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
