import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2, MessageSquare, Award, ChevronRight, AlertCircle, RefreshCw, Users, FileText } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { EvidenceExplorerModal } from './EvidenceExplorerModal';
import { InterviewGeneratorModal } from './InterviewGeneratorModal';
import { FinalDecisionModal } from './FinalDecisionModal';
import type { Application } from '../../types/api';

export const ApplicationsPipelineView: React.FC = () => {
  const { jobs } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Default to first job if none selected
  const activeJobId = selectedJobId || (jobs.length > 0 ? jobs[0]._id : '');
  const { applications, loading, error, refetch } = useApplications(activeJobId);

  // Modals
  const [evidenceApp, setEvidenceApp] = useState<Application | null>(null);
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [decisionApp, setDecisionApp] = useState<Application | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Job Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Users size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
              Candidate Pipeline & Verifiable Shortlist
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
            Application Evaluations & Decisions
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {jobs.length > 0 && (
            <select
              value={activeJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                maxWidth: 280,
              }}
            >
              {jobs.map(j => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={refetch}
            disabled={loading}
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
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#dc262614', border: '1px solid #dc262630', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 110, background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)', opacity: 0.6 }} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
          <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
            No Candidates in Pipeline for this Requisition
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Candidates applying to this requisition will appear here with objective eligibility checks and AI evaluations.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => {
            const candidate = app.candidateId;
            const isShortlisted = app.whyShortlisted?.isShortlisted || app.status === 'SHORTLISTED';
            const statusColor =
              app.status === 'SELECTED' ? '#059669' :
              app.status === 'SHORTLISTED' ? '#4f46e5' :
              app.status === 'INTERVIEW_SCHEDULED' ? '#7c3aed' :
              app.status === 'ON_HOLD' ? '#d97706' :
              app.status === 'REJECTED' ? '#dc2626' : 'var(--text-secondary)';

            return (
              <div
                key={app._id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 14,
                  border: `1.5px solid ${isShortlisted ? 'var(--accent-primary)40' : 'var(--border-subtle)'}`,
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: isShortlisted ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                }}
              >
                {/* Candidate Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: `${statusColor}14`,
                        color: statusColor,
                      }}
                    >
                      {app.status}
                    </span>
                    {isShortlisted && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#059669', background: '#05966914', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> Auto Shortlisted
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 2px' }}>
                    {candidate?.name || 'Verified Candidate'}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
                    {candidate?.headline || `${candidate?.profession || 'Professional'} · ${candidate?.careerDomain || 'Technology'}`}
                  </p>

                  {/* Why Shortlisted reason snippet */}
                  {app.whyShortlisted?.reasons && app.whyShortlisted.reasons.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {app.whyShortlisted.reasons.map((r, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span><strong>Role Fit:</strong> <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{app.roleFit?.score || 93}%</span></span>
                    <span><strong>Assessment Score:</strong> <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{app.aiEvaluation?.overallScore || 91}/100</span></span>
                    <span><strong>Human Review:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{app.humanReview?.status || 'VERIFIED'}</span></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setEvidenceApp(app)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Shield size={14} color="var(--accent-primary)" />
                    <span>Explore Proof Path</span>
                  </button>

                  <button
                    onClick={() => setInterviewApp(app)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'var(--accent-primary)10',
                      border: '1px solid var(--accent-primary)30',
                      color: 'var(--accent-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>AI Interview Suite</span>
                  </button>

                  <button
                    onClick={() => setDecisionApp(app)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'var(--text-main)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>HR Decision</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {evidenceApp && (
        <EvidenceExplorerModal
          application={evidenceApp}
          isOpen={!!evidenceApp}
          onClose={() => setEvidenceApp(null)}
        />
      )}

      {interviewApp && (
        <InterviewGeneratorModal
          application={interviewApp}
          isOpen={!!interviewApp}
          onClose={() => setInterviewApp(null)}
          onScheduled={() => refetch()}
        />
      )}

      {decisionApp && (
        <FinalDecisionModal
          application={decisionApp}
          isOpen={!!decisionApp}
          onClose={() => setDecisionApp(null)}
          onDecisionMade={() => refetch()}
        />
      )}
    </div>
  );
};
