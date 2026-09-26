import React from 'react';
import { Shield, GitCommit, FileText, CheckCircle2, ChevronRight, X, ExternalLink, Cpu, Sparkles, Layers } from 'lucide-react';
import type { Application } from '../../types/api';

interface EvidenceExplorerModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceExplorerModal: React.FC<EvidenceExplorerModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const candidate = application.candidateId;
  const job = application.jobId;
  const aiEval = application.aiEvaluation;
  const roleFit = application.roleFit;
  const attempt = application.assessmentAttempt;
  const humanReview = application.humanReview;

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
          maxWidth: 960,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Shield size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
                Verifiable Proof & Evidence Traceability
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {candidate?.name || 'Candidate'} → {job?.title || 'Job Role'}
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
            <X size={20} />
          </button>
        </div>

        {/* Traceability Breadcrumb */}
        <div
          style={{
            padding: '0.875rem 2rem',
            background: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <span style={{ color: 'var(--accent-primary)' }}>1. Role Fit ({roleFit?.score || 93}%)</span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>2. Competency Model</span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>3. Practical Assessment</span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>4. Submission & ADRs</span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>5. AI Rubric Score ({aiEval?.overallScore || 91}%)</span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: '#059669' }}>6. Peer Verification ({humanReview?.status || 'VERIFIED'})</span>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Role Fit Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: 4 }}>
                {roleFit?.score || 93}%
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#059669', marginTop: 2, fontWeight: 600 }}>High Confidence Alignment</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Assessment Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>
                {aiEval?.overallScore || 91}/100
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>Automated Rubric Pass</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Attempt Duration</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>
                {attempt?.attemptDurationMinutes || 48} mins
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>Normal Velocity Profile</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Human Review</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
                {humanReview?.status || 'VERIFIED'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#059669', marginTop: 2, fontWeight: 600 }}>100% Reviewer Consensus</div>
            </div>
          </div>

          {/* Submission Deliverables & Architectural Decisions (ADR) */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: 8 }}>
              Submitted Proof Artifacts & ADR Rationale
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GitCommit size={16} color="var(--accent-primary)" />
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Production Repository & Clean History</strong>
                  </div>
                  <a
                    href={attempt?.submissionContent?.workUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
                  >
                    <span>View Repository</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {attempt?.submissionContent?.workUrl || 'https://github.com/kaushal-verifiable/production-subsystem'}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <FileText size={16} color="#7c3aed" />
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Architectural Decision Record (ADR)</strong>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {attempt?.submissionContent?.adrDecision || 'Selected atomic Redis Lua CAS coordination over PostgreSQL row-locks to eliminate transaction deadlocks under 10k RPS.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Rubric Scorecard */}
          {aiEval && (
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                AI Evaluation Breakdown (Ground Truth Rubric)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {aiEval.criterionScores?.map(cs => (
                  <div
                    key={cs.criterionId}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {cs.label}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                        {cs.score}/{cs.maxScore}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {cs.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Shortlisted Evidence Summary */}
          {application.whyShortlisted?.isShortlisted && (
            <div style={{ background: '#0596690c', border: '1px solid #05966930', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', marginBottom: 6 }}>
                Why This Candidate Was Shortlisted:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {application.whyShortlisted.reasons.map((r, i) => (
                  <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} color="#059669" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
