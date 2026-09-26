import React from 'react';
import { Award, ShieldCheck, CheckCircle2, User, Share2 } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';

interface PassportHeaderProps {
  passport?: any;
  onShare?: () => void;
}

export const PassportHeader: React.FC<PassportHeaderProps> = ({ passport, onShare }) => {
  return (
    <div
      className="forge-card"
      style={{
        padding: '2rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Avatar */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-subtle) 0%, rgba(79, 70, 229, 0.15) 100%)',
            border: '2px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            fontSize: '1.5rem',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          RS
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Rahul Sharma
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--emerald-verified)',
                background: 'var(--emerald-subtle)',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(5, 150, 105, 0.25)',
              }}
            >
              ● Proof Confidence: High
            </span>
          </div>

          <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Backend Engineer · Distributed Systems & Concurrency
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn btn-primary"
          onClick={onShare}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
        >
          <Share2 size={16} />
          <span>Share Proof Passport</span>
        </button>
      </div>
    </div>
  );
};
