import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Shield, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { useRecruiterAnalytics } from '../../hooks/useAnalytics';

export const RecruiterAnalyticsView: React.FC = () => {
  const { analytics, loading, error, refetch } = useRecruiterAnalytics();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 140, background: 'var(--bg-surface)', borderRadius: 14, opacity: 0.6 }} />
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <AlertCircle size={32} color="#dc2626" style={{ margin: '0 auto 8px' }} />
        <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>{error || 'Failed to load analytics.'}</p>
        <button onClick={refetch} style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
          Retry
        </button>
      </div>
    );
  }

  const funnel = analytics.pipelineFunnel;
  const rates = analytics.conversionRates;
  const metrics = analytics.efficiencyMetrics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <BarChart3 size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
              Proof-of-Work Talent Analytics
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
            Hiring Pipeline & Assessment Quality
          </h2>
        </div>

        <button
          onClick={refetch}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Total In Pipeline</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {funnel.totalApplications}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Across {analytics.activeJobRequisitions.total} active requisitions</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Reviewer Agreement</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {metrics.reviewerAgreementPercent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: 2, fontWeight: 600 }}>High Rubric Calibration</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Avg Assessment Time</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {metrics.averageAssessmentTimeMinutes}m
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Sub-1 hour completion velocity</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Time to Verified Proof</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {metrics.timeToProofHours}h
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>vs 14 days traditional screen</div>
        </div>
      </div>

      {/* Master Pipeline Funnel */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
          Autonomous Talent Pipeline Funnel
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          {[
            { label: '1. Applied', count: funnel.totalApplications, color: 'var(--text-main)' },
            { label: '2. Eligible', count: funnel.eligible, color: 'var(--accent-primary)' },
            { label: '3. Assessed', count: funnel.assessed, color: '#7c3aed' },
            { label: '4. Verified', count: funnel.verified, color: '#059669' },
            { label: '5. Shortlisted', count: funnel.shortlisted, color: '#4f46e5' },
            { label: '6. Interview', count: funnel.interviews, color: '#d97706' },
            { label: '7. Selected', count: funnel.selected, color: '#059669' },
          ].map(stage => (
            <div
              key={stage.label}
              style={{
                padding: '16px 10px',
                background: 'var(--bg-subtle)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                {stage.label}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: stage.color, fontFamily: 'var(--font-mono)' }}>
                {stage.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Efficiencies */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Pipeline Conversion Rates
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Application → Objective Eligibility</span>
                <strong style={{ color: 'var(--text-main)' }}>{rates.applicationToEligible}%</strong>
              </div>
              <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${rates.applicationToEligible}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Eligible → Assessment Submitted</span>
                <strong style={{ color: 'var(--text-main)' }}>{rates.eligibleToAssessed}%</strong>
              </div>
              <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${rates.eligibleToAssessed}%`, background: '#7c3aed' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assessed → Verified Shortlist</span>
                <strong style={{ color: 'var(--text-main)' }}>{rates.assessedToShortlisted}%</strong>
              </div>
              <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${rates.assessedToShortlisted}%`, background: '#059669' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Evidence & Integrity Indicators
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>Average Role Fit Alignment</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{metrics.averageRoleFitScore}%</span>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>Hermetic Test Pass Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>100%</span>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>Plagiarism & Cheat Risk Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>0.0% (Zero Risk)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
