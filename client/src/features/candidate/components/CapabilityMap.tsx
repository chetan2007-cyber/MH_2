import React from 'react';
import { ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Skeleton } from '../../../components/ui';

interface CapabilityMapProps {
  capabilities: any[];
  loading: boolean;
  onNavigate: (view: string, extra?: any) => void;
  onSelectWhy: (cap: any) => void;
}

export const CapabilityMap: React.FC<CapabilityMapProps> = ({
  capabilities,
  loading,
  onNavigate,
  onSelectWhy,
}) => {
  // Default canonical data as requested in Section 9 if backend returns empty/partial
  const defaultCapabilities = [
    {
      dimension: 'BACKEND',
      displayName: 'Backend',
      score: 87,
      confidence: 'High confidence',
      projectsCount: 4,
      reviewsCount: 7,
      evidenceSummary: '4 verified projects · 7 expert reviews',
    },
    {
      dimension: 'TESTING',
      displayName: 'Testing',
      score: 91,
      confidence: 'High confidence',
      projectsCount: 5,
      reviewsCount: 8,
      evidenceSummary: '5 verified projects · 8 expert reviews',
    },
    {
      dimension: 'SYSTEM_DESIGN',
      displayName: 'System Design',
      score: 82,
      confidence: 'High confidence',
      projectsCount: 3,
      reviewsCount: 6,
      evidenceSummary: '3 verified projects · 6 expert reviews',
    },
    {
      dimension: 'DATABASE',
      displayName: 'Database',
      score: 79,
      confidence: 'High confidence',
      projectsCount: 4,
      reviewsCount: 5,
      evidenceSummary: '4 verified projects · 5 expert reviews',
    },
    {
      dimension: 'SECURITY',
      displayName: 'Security',
      score: 68,
      confidence: 'Medium confidence',
      projectsCount: 2,
      reviewsCount: 4,
      evidenceSummary: '2 verified projects · 4 expert reviews',
    },
  ];

  // Merge loaded capabilities with defaults for rich presentation
  const displayItems =
    capabilities && capabilities.length > 0
      ? defaultCapabilities.map((def) => {
          const match = capabilities.find(
            (c) =>
              c.dimension?.toUpperCase() === def.dimension ||
              c.displayName?.toLowerCase().includes(def.displayName.toLowerCase())
          );
          return match
            ? {
                ...def,
                score: match.score || def.score,
                confidence: match.score >= 75 ? 'High confidence' : 'Medium confidence',
                projectsCount: match.explanation?.projectsCount || def.projectsCount,
                reviewsCount: match.explanation?.expertReviewsCount || def.reviewsCount,
              }
            : def;
        })
      : defaultCapabilities;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Your Engineering Capabilities
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Score, confidence rating, and verified evidence count per system dimension.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('proofgraph')}
          rightIcon={<ChevronRight size={14} />}
        >
          View in ProofGraph™
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="forge-card" style={{ padding: '1.25rem' }}>
              <Skeleton height="1.25rem" width="30%" style={{ marginBottom: '0.75rem' }} />
              <Skeleton height="10px" width="100%" style={{ marginBottom: '0.5rem' }} />
              <Skeleton height="1rem" width="40%" />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {displayItems.map((item) => (
            <div
              key={item.dimension}
              className="forge-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'border-color 0.15s ease',
              }}
            >
              {/* Row 1: Title, Confidence, Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.displayName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: item.confidence === 'High confidence' ? 'var(--emerald-verified)' : 'var(--amber-warning)',
                      background: item.confidence === 'High confidence' ? 'var(--emerald-subtle)' : 'var(--amber-subtle)',
                      padding: '0.15rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${item.confidence === 'High confidence' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
                    }}
                  >
                    ● {item.confidence}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-main)',
                    }}
                  >
                    {item.score}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              {/* Row 2: Capability Progress Bar */}
              <div
                style={{
                  height: '8px',
                  background: 'var(--bg-app)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${item.score}%`,
                    background:
                      item.score >= 85
                        ? 'linear-gradient(90deg, var(--accent-primary) 0%, var(--emerald-verified) 100%)'
                        : 'linear-gradient(90deg, var(--accent-primary) 0%, var(--cyan-primary) 100%)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              {/* Row 3: Evidence counts and "Why score?" */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.projectsCount} verified projects · {item.reviewsCount} expert reviews
                </span>

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.2rem 0.5rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => onSelectWhy(item)}
                >
                  <span>Why {item.score}?</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
