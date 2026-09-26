import React from 'react';
import { ShieldCheck, FileCode, Users, Flame } from 'lucide-react';

interface ProofStrengthCardProps {
  topScore?: number;
  passport?: any;
}

export const ProofStrengthCard: React.FC<ProofStrengthCardProps> = ({ topScore = 78, passport }) => {
  const verifiedProjectsCount = passport?.metrics?.totalProjects || 6;
  const expertReviewsCount = passport?.metrics?.expertReviews || 8;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {/* 1. Proof Strength */}
      <div className="forge-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="form-label" style={{ margin: 0, fontSize: '0.8125rem' }}>Proof Strength</span>
          <ShieldCheck size={16} color="var(--accent-primary)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)', lineHeight: 1 }}>
            {topScore || 78}
          </span>
          <span style={{ color: 'var(--emerald-verified)', fontWeight: 600, fontSize: '0.8125rem' }}>
            ● Strong evidence
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Consistently verified across 5 capability dimensions
        </div>
      </div>

      {/* 2. Verified Projects */}
      <div className="forge-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="form-label" style={{ margin: 0, fontSize: '0.8125rem' }}>Verified Projects</span>
          <FileCode size={16} color="var(--cyan-primary)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)', lineHeight: 1 }}>
            {verifiedProjectsCount}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
            Projects
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          14 accepted ADR decisions · Hermetic tests
        </div>
      </div>

      {/* 3. Expert Reviews */}
      <div className="forge-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="form-label" style={{ margin: 0, fontSize: '0.8125rem' }}>Expert Reviews</span>
          <Users size={16} color="var(--purple-accent)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)', lineHeight: 1 }}>
            {expertReviewsCount}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
            Audits
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Double-blind calibrated evaluation by senior engineers
        </div>
      </div>

      {/* 4. Current Streak (Subtle - Not Gamified) */}
      <div className="forge-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="form-label" style={{ margin: 0, fontSize: '0.8125rem' }}>Current Streak</span>
          <Flame size={16} color="var(--amber-warning)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)', lineHeight: 1 }}>
            4
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
            challenges
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Consistent proof submissions this month
        </div>
      </div>
    </div>
  );
};
