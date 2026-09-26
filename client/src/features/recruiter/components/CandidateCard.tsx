import React from 'react';
import { Layers, Bookmark, Send, CheckCircle2, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface CandidateCardProps {
  candidate: any;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onOpenProofGraph: (id: string) => void;
  onSelectForOpportunity: (candidate: any) => void;
  onViewCandidateDetails?: (candidate: any) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSaved = false,
  onToggleSave,
  onOpenProofGraph,
  onSelectForOpportunity,
  onViewCandidateDetails,
}) => {
  const backendScore = candidate.backendScore || 87;
  const systemDesignScore = candidate.systemDesignScore || 82;
  const testingScore = candidate.testingScore || 91;
  const verifiedProjectsCount = candidate.verifiedProjectsCount || 6;
  const expertReviewsCount = candidate.expertReviewsCount || 8;

  return (
    <div
      className="forge-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div>
        {/* Header: Candidate Name, Role, Bookmark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {candidate.name || 'Rahul Sharma'}
              </h3>
              <CheckCircle2 size={16} color="var(--emerald-verified)" />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
              {candidate.headline || 'Backend Engineer'}
            </p>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--emerald-verified)',
              background: 'var(--emerald-subtle)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
            }}
          >
            ● High proof confidence
          </span>
        </div>

        {/* 3 Core Capabilities (Section 22: Backend 87, System Design 82, Testing 91) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            margin: '1rem 0',
            background: 'var(--bg-app)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Backend
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
              {backendScore}
            </div>
          </div>

          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Design
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
              {systemDesignScore}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Testing
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-verified)' }}>
              {testingScore}
            </div>
          </div>
        </div>

        {/* Verified Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span>{verifiedProjectsCount} verified projects</span>
          <span>·</span>
          <span>{expertReviewsCount} expert reviews</span>
        </div>
      </div>

      {/* Buttons: Explore Proof → and Create Opportunity */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            if (onViewCandidateDetails) onViewCandidateDetails(candidate);
            else onOpenProofGraph(candidate.candidateId || 'cand-rahul');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
        >
          <span>Explore Proof</span>
          <ArrowRight size={14} />
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onSelectForOpportunity(candidate)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
        >
          <Send size={13} />
          <span>Opportunity</span>
        </button>
      </div>
    </div>
  );
};
