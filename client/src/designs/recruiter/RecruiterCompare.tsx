import React, { useState } from 'react';
import {
  ChevronLeft, CheckCircle2, GitCommit, FileText,
  Shield, BarChart2, ArrowRight, X, ExternalLink, Sparkles, Award
} from 'lucide-react';

interface RecruiterCompareProps {
  candidates: any[];
  onRemove: (id: string) => void;
  onViewDossier: (c: any) => void;
}

const COMPARISON_DIMENSIONS = [
  {
    id: 'craft_execution',
    label: 'Craft & Execution Quality',
    description: 'Primary domain execution, attention to detail, and core capability scores',
  },
  {
    id: 'methodology_process',
    label: 'Methodology & Decision Trail',
    description: 'Documented rationale, architectural trade-offs, briefs, or iteration processes',
  },
  {
    id: 'peer_audit',
    label: 'Peer Audit & Verification',
    description: 'Formal score from domain experts under standardized evaluation rubrics',
  },
  {
    id: 'defense_depth',
    label: 'Live Defense & Reasoning',
    description: 'Ability to defend decisions under interrogation and handle edge cases',
  },
];

export const RecruiterCompare: React.FC<RecruiterCompareProps> = ({
  candidates,
  onRemove,
  onViewDossier,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  if (candidates.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <BarChart2 size={24} color="var(--text-muted)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
            No Candidates in Comparison
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Search candidates across any career domain and click "Compare" to evaluate verified proof side-by-side.
          </p>
        </div>
      </div>
    );
  }

  const getEvidenceForCandidate = (c: any, dimId: string) => {
    const cap1 = c.capabilities?.[0] || { label: 'Primary Skill', score: 85 };
    const cap2 = c.capabilities?.[1] || { label: 'Secondary Skill', score: 80 };

    switch (dimId) {
      case 'craft_execution':
        return {
          summary: `${cap1.label} (${cap1.score}/100) · ${cap2.label} (${cap2.score}/100)`,
          proofPoints: [
            `${c.verifiedProjects} verified deliverables in ${c.domain}`,
            `Recent: ${c.recentProof?.title || 'Production System'}`,
            `Overall Proof Score: ${c.proofScore}/100`,
          ],
        };
      case 'methodology_process':
        return {
          summary: `Documented: "${c.techDecision}"`,
          proofPoints: [
            `Detailed decision justification submitted with source`,
            `Clear boundary definition and trade-off considerations`,
            `Complete methodology paper reviewed by peer panel`,
          ],
        };
      case 'peer_audit':
        return {
          summary: `${c.expertReviews} Expert Audits Passed`,
          proofPoints: [
            `Audited against standardized ${c.domain} evaluation rubric`,
            `Status: ${c.recentProof?.status || 'Verified'}`,
            `Zero unaddressed compliance or quality flags`,
          ],
        };
      case 'defense_depth':
        return {
          summary: `${c.defenseRounds} Defense Round${c.defenseRounds === 1 ? '' : 's'} Passed`,
          proofPoints: [
            `Successfully defended core hypotheses and trade-offs`,
            `Interrogated by senior domain reviewers`,
            `Demonstrated clear domain reasoning under cross-examination`,
          ],
        };
      default:
        return {
          summary: 'Verified',
          proofPoints: [],
        };
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
              Side-by-Side Proof Comparison
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Comparing verified deliverables and reasoning across {candidates.length} candidates.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Highlight Capability Deltas
          </label>
        </div>

        {/* Candidate Columns Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `240px repeat(${candidates.length}, 1fr)`,
            gap: '1rem',
            marginBottom: '1.25rem',
            alignItems: 'stretch',
          }}
        >
          <div style={{ padding: '1rem', background: 'transparent' }} />
          {candidates.map((c) => (
            <div
              key={c.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '1.25rem',
                position: 'relative',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <button
                onClick={() => onRemove(c.id)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                }}
                title="Remove candidate"
              >
                <X size={14} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                  }}
                >
                  {c.initials}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {c.name}
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: c.gradientFrom, fontWeight: 700 }}>
                    {c.domain}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {c.proofScore}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100 Proof Score</span>
              </div>

              <button
                onClick={() => onViewDossier(c)}
                style={{
                  width: '100%',
                  padding: '7px',
                  borderRadius: 7,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Inspect Dossier
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Matrix Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {COMPARISON_DIMENSIONS.map((dim) => (
            <div
              key={dim.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `240px repeat(${candidates.length}, 1fr)`,
                  gap: '1rem',
                  padding: '1.25rem',
                  alignItems: 'start',
                }}
              >
                {/* Dimension label */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                    {dim.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                    {dim.description}
                  </p>
                </div>

                {/* Candidate evidence cells */}
                {candidates.map((c) => {
                  const ev = getEvidenceForCandidate(c, dim.id);
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--bg-subtle)',
                        borderRadius: 10,
                        padding: '1rem',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <CheckCircle2 size={13} color="#059669" />
                        {ev.summary}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {ev.proofPoints.map((pt: string, idx: number) => (
                          <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
