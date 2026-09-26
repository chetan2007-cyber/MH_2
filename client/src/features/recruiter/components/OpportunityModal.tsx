import React, { useState } from 'react';
import { Send, X, CheckCircle2, Building, Briefcase } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface OpportunityModalProps {
  candidate: any;
  onClose: () => void;
  onSend: (data: any) => Promise<void>;
  sending: boolean;
  successMsg: string | null;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  candidate,
  onClose,
  onSend,
  sending,
  successMsg,
}) => {
  const [role, setRole] = useState('Backend Engineer');
  const [organization, setOrganization] = useState('Acme Technologies');
  const [matchedCapabilities] = useState(['Backend', 'PostgreSQL', 'System Design']);
  const [whyCandidate, setWhyCandidate] = useState(
    'Your high-concurrency API project and database architecture evidence match what we\'re looking for.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      role,
      organization,
      matchedCapabilities,
      whyCandidate,
    });
  };

  if (!candidate) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Create Opportunity
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Direct outreach for <strong style={{ color: 'var(--text-main)' }}>{candidate.name || 'Rahul Sharma'}</strong> backed by verified proof.
            </p>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--emerald-subtle)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={32} color="var(--emerald-verified)" />
            <div style={{ fontWeight: 800, color: 'var(--emerald-verified)', fontSize: '1.125rem' }}>
              Opportunity Dispatched!
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Role
              </label>
              <input
                type="text"
                className="input-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            {/* Organization */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Organization
              </label>
              <input
                type="text"
                className="input-field"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>

            {/* Matched Capabilities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Matched capabilities
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {matchedCapabilities.map((cap) => (
                  <span
                    key={cap}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-subtle)',
                      border: '1px solid rgba(79, 70, 229, 0.25)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Why this candidate? */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Why this candidate?
              </label>
              <textarea
                rows={4}
                className="input-field"
                value={whyCandidate}
                onChange={(e) => setWhyCandidate(e.target.value)}
                style={{ resize: 'vertical', lineHeight: 1.5 }}
                required
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem' }}
              >
                <Send size={15} />
                <span>{sending ? 'Sending...' : 'Send Opportunity'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
