import React from 'react';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface ContinueChallengeCardProps {
  onStartChallenge: (submissionId: string) => void;
}

export const ContinueChallengeCard: React.FC<ContinueChallengeCardProps> = ({ onStartChallenge }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
        Continue Your Proof
      </h2>

      <div
        className="forge-card"
        style={{
          padding: '1.75rem',
          background: 'var(--bg-surface)',
          border: '1.5px solid rgba(79, 70, 229, 0.2)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--purple-accent)',
                  background: 'var(--purple-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                }}
              >
                Advanced
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Backend · PostgreSQL · Redis
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              High-Concurrency Ticket Booking API
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '640px', lineHeight: 1.5, marginBottom: 0 }}>
              Prevent overselling under 25,000 req/sec flash sales. Lock-free atomic decrements verified. Complete remaining tests and architectural defense to finalize proof.
            </p>
          </div>

          <div style={{ textAlign: 'right', minWidth: '100px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', lineHeight: 1.2 }}>
              72%
            </div>
          </div>
        </div>

        {/* Evidence Status Checkpoints */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            padding: '0.85rem 1rem',
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Evidence:
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
            <Check size={15} strokeWidth={2.5} />
            <span>Architecture</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
            <Check size={15} strokeWidth={2.5} />
            <span>ADR</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Circle size={13} strokeWidth={2} />
            <span>Tests</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Circle size={13} strokeWidth={2} />
            <span>Defense</span>
          </div>
        </div>

        {/* Progress Bar & CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.25rem' }}>
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <div
              style={{
                height: '6px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '72%',
                  background: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onStartChallenge('6ab776c6ef1c989d749010c2')}
            style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <span>Continue Challenge</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
