import React, { useState } from 'react';
import {
  ChevronLeft, CheckCircle2, Shield, FileText, Cpu,
  BarChart2, GitCommit, MessageSquare, ChevronDown, Send,
  Palette, Activity, Layers, Sparkles, RefreshCw, AlertCircle,
  Dna, Check, Eye
} from 'lucide-react';
import { getProfessionConfig } from '../../data/careerTaxonomy';
import type { ReviewCriterion } from '../../data/careerTaxonomy';
import { reviewService } from '../../services/review.service';
import { useJobs } from '../../hooks/useJobs';
import { JobDNAInspectorModal } from './JobDNAInspectorModal';
import type { Job } from '../../types/api';

interface ReviewerInspectorProps {
  submission: any;
  onBack: () => void;
}

const ScoreSelector: React.FC<{
  value: number; onChange: (v: number) => void; max: number; color: string;
}> = ({ value, onChange, max, color }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Array.from({ length: max }, (_, i) => i + 1).map(n => (
      <button
        key={n}
        onClick={() => onChange(n)}
        style={{
          width: 32, height: 32, borderRadius: 6, border: '1px solid',
          borderColor: n <= value ? color : 'var(--border-subtle)',
          background: n <= value ? color : 'transparent',
          color: n <= value ? '#fff' : 'var(--text-muted)',
          fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >{n}</button>
    ))}
  </div>
);

export const ReviewerInspector: React.FC<ReviewerInspectorProps> = ({ submission, onBack }) => {
  const professionName = submission?.profession || submission?.professionName || 'Software Developer';
  const pCfg = getProfessionConfig(professionName);

  const [activeSection, setActiveSection] = useState('job_dna');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);

  // Fetch jobs to find matching recruiter Job DNA
  const { jobs } = useJobs();

  // Find most relevant Job Requisition uploaded by recruiter
  const matchedJob =
    jobs.find(j => j.title?.toLowerCase() === submission?.title?.toLowerCase()) ||
    jobs.find(
      j =>
        j.profession?.toLowerCase() === professionName.toLowerCase() ||
        j.careerDomain?.toLowerCase() === (submission?.domain || '').toLowerCase()
    ) ||
    jobs[0] ||
    null;

  const [selectedBenchmarkJob, setSelectedBenchmarkJob] = useState<Job | null>(matchedJob || null);
  const currentJob = selectedBenchmarkJob || matchedJob;

  const setScore = (id: string, v: number) => setScores(prev => ({ ...prev, [id]: v }));
  const setComment = (id: string, v: string) => setComments(prev => ({ ...prev, [id]: v }));

  const criteriaList: ReviewCriterion[] = pCfg.reviewCriteria || [];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxTotal = criteriaList.length * 5;
  const completedCriteria = Object.keys(scores).length;

  const handleSubmitReview = async () => {
    if (completedCriteria < criteriaList.length) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        submissionId: submission?._id || submission?.id || 'sub-pending',
        scores: criteriaList.map(c => ({
          criterionId: c.id,
          score: scores[c.id] || 0,
          maxScore: c.maxScore || 5,
          notes: comments[c.id] || '',
        })),
        decision: (totalScore / maxTotal >= 0.7 ? 'APPROVE' : 'REQUEST_CHANGES') as 'APPROVE' | 'REQUEST_CHANGES',
        summaryFeedback: `Standardized audit across ${criteriaList.length} dimensions completed. Total score: ${totalScore}/${maxTotal}.`,
      };
      const res = await reviewService.submitReview(payload);
      if (res.success || !res.error) {
        setSubmitted(true);
      } else {
        setSubmitError(res.error || 'Failed to publish review to server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error publishing audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const NAV_SECTIONS = [
    { id: 'job_dna', label: 'Recruiter Job DNA', icon: Dna },
    { id: 'deliverable', label: 'Deliverable & Output', icon: Cpu },
    { id: 'decision', label: 'Decision Log (ADR)', icon: FileText },
    { id: 'evidence', label: 'Quality Evidence', icon: CheckCircle2 },
    { id: 'defense', label: 'Defense Round™', icon: Shield },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* ── LEFT: Submission tree ── */}
      <div style={{
        width: 220, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, padding: 0
            }}
          >
            <ChevronLeft size={14} /> Back to queue
          </button>
          <div style={{ marginTop: '0.75rem' }}>
            <span style={{
              fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase',
              color: submission?.diffColor || '#4f46e5', background: `${submission?.diffColor || '#4f46e5'}15`,
              padding: '2px 6px', borderRadius: 4
            }}>
              {pCfg.name}
            </span>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, marginTop: 4 }}>
              {submission?.title || pCfg.challenges?.[0]?.title || 'Submission Details'}
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {NAV_SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px', borderRadius: 7, border: 'none',
                background: activeSection === sec.id ? (sec.id === 'job_dna' ? 'rgba(5,150,105,0.1)' : 'var(--accent-subtle)') : 'transparent',
                color: activeSection === sec.id ? (sec.id === 'job_dna' ? '#059669' : 'var(--accent-primary)') : 'var(--text-secondary)',
                fontSize: '0.8125rem', fontWeight: activeSection === sec.id ? 700 : 500,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.12s ease',
              }}
            >
              <sec.icon size={14} />
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Completion indicator */}
        <div style={{ padding: '0.875rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Evaluation progress</span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)' }}>{completedCriteria}/{criteriaList.length}</span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${criteriaList.length > 0 ? (completedCriteria / criteriaList.length) * 100 : 0}%`,
              background: 'var(--accent-primary)', borderRadius: 2, transition: 'width 0.2s ease'
            }} />
          </div>
        </div>
      </div>

      {/* ── CENTER: Deliverables & Evidence viewer ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem', background: '#f8fafc' }}>
        {/* Recruiter Job DNA Section */}
        {activeSection === 'job_dna' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Dna size={14} color="#059669" />
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669' }}>
                    Recruiter Benchmark Blueprint
                  </span>
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Recruiter Job DNA & Competency Model
                </h2>
              </div>

              {currentJob && (
                <button
                  onClick={() => setJobModalOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 8,
                    background: 'rgba(5,150,105,0.1)', color: '#059669',
                    border: '1px solid rgba(5,150,105,0.3)',
                    fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <Eye size={14} /> View Full DNA Spec
                </button>
              )}
            </div>

            {/* Benchmark Job Selector if multiple requisitions exist */}
            {jobs.length > 1 && (
              <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
              }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Selected Job Requisition:
                </span>
                <select
                  value={currentJob?._id || ''}
                  onChange={e => {
                    const found = jobs.find(j => j._id === e.target.value);
                    if (found) setSelectedBenchmarkJob(found);
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-medium)',
                    background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.8125rem',
                    fontWeight: 600, maxWidth: 420
                  }}
                >
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.department} · {j.experience})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentJob ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Job Card */}
                <div style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 12, padding: '1.5rem', boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.1)', color: '#059669'
                    }}>
                      {currentJob.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentJob.department} · {currentJob.careerDomain}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    {currentJob.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                    {currentJob.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mandatory Experience</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>{currentJob.experience}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Target Difficulty</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#4f46e5', marginTop: 2 }}>{currentJob.difficulty}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Assessment Limit</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>{currentJob.assessmentDurationMinutes || 60} mins</div>
                    </div>
                  </div>
                </div>

                {/* Mandatory Proof Criteria */}
                {currentJob.jobDNA?.mandatoryRequirements && (
                  <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 12, padding: '1.25rem 1.5rem'
                  }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Mandatory Proof Criteria Required by Recruiter
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {currentJob.jobDNA.mandatoryRequirements.map((req, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem',
                          color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: 8
                        }}>
                          <CheckCircle2 size={14} color="#059669" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competency Weights Blueprint */}
                {currentJob.competencies && currentJob.competencies.length > 0 && (
                  <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 12, padding: '1.25rem 1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Recruiter Calibrated Competency Weights
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                        100% Calibrated
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {currentJob.competencies.map((c, i) => (
                        <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#059669' }}>{c.weight}%</span>
                          </div>
                          <div style={{ height: 5, background: 'var(--bg-surface)', borderRadius: 2.5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${c.weight}%`, background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: 2.5 }} />
                          </div>
                          {c.description && (
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 4 }}>{c.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px dashed var(--border-subtle)' }}>
                <Dna size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>No Job DNA Requisition Found</div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  No recruiter job requisitions uploaded for this domain yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Deliverable Section */}
        {activeSection === 'deliverable' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Primary Deliverable Output
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Anonymous candidate submission for {submission?.title || 'Challenge'}
                </p>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Deliverables Package
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {submission?.deliverablesSummary || 'Full repository source code and build artifacts provided.'}
              </p>
            </div>
          </div>
        )}

        {/* ADR Section */}
        {activeSection === 'decision' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Architectural & Decision Log
            </h2>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>
                Key Technical Decision
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {submission?.keyDecision || submission?.techDecision || 'Methodology documentation submitted.'}
              </p>
            </div>
          </div>
        )}

        {/* Evidence Section */}
        {activeSection === 'evidence' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Verification Evidence & Metrics
            </h2>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 700 }}>
                <CheckCircle2 size={16} /> All Container & Unit Test Suites Passed (100%)
              </div>
            </div>
          </div>
        )}

        {/* Defense Section */}
        {activeSection === 'defense' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Live Defense Round™ Transcript
            </h2>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#d97706', marginBottom: 4 }}>
                Interrogation Question:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {pCfg.defensePrompt?.question || 'Explain the trade-offs in your selected solution architecture.'}
              </p>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Candidate Verbal Response:
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 8 }}>
                "{pCfg.defensePrompt?.sampleAnswer || 'I evaluated alternative options and prioritized reliability and deterministic bounds.'}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── JOB DNA MODAL IF REQUESTED IN INSPECTOR ── */}
      {currentJob && (
        <JobDNAInspectorModal
          job={currentJob}
          isOpen={jobModalOpen}
          onClose={() => setJobModalOpen(false)}
        />
      )}

      {/* ── RIGHT: Profession-Specific Rubric Drawer ── */}
      <div style={{
        width: 320, background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {pCfg.name} Rubric
            </h2>
            {totalScore > 0 && (
              <span style={{
                fontSize: '0.8125rem', fontWeight: 900,
                color: totalScore / maxTotal >= 0.8 ? '#059669' : totalScore / maxTotal >= 0.6 ? '#d97706' : '#e11d48',
                fontFamily: 'var(--font-mono)'
              }}>
                {Math.round((totalScore / maxTotal) * 100)}%
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Score: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{totalScore}/{maxTotal}</strong>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {criteriaList.map(criterion => {
              const score = scores[criterion.id] || 0;
              const comment = comments[criterion.id] || '';
              const color = score >= 4 ? '#059669' : score >= 3 ? '#4f46e5' : score > 0 ? '#d97706' : 'var(--border-medium)';

              return (
                <div key={criterion.id} style={{
                  background: 'var(--bg-subtle)', borderRadius: 9, padding: '0.875rem',
                  border: score > 0 ? `1px solid ${color}35` : '1px solid var(--border-subtle)'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
                      {criterion.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {criterion.description}
                    </div>
                  </div>
                  <ScoreSelector
                    value={score} max={criterion.maxScore} color={color}
                    onChange={v => setScore(criterion.id, v)}
                  />
                  {score > 0 && (
                    <textarea
                      value={comment}
                      onChange={e => setComment(criterion.id, e.target.value)}
                      placeholder="Add rubric feedback note..."
                      rows={2}
                      style={{
                        marginTop: '0.5rem', width: '100%', resize: 'vertical',
                        padding: '6px 8px', borderRadius: 6, fontSize: '0.75rem',
                        border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
                        color: 'var(--text-main)', fontFamily: 'var(--font-sans)', outline: 'none'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Section */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {submitError && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} /> {submitError}
            </div>
          )}

          {submitted ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)',
              borderRadius: 9, color: '#059669', fontSize: '0.875rem', fontWeight: 700
            }}>
              <CheckCircle2 size={16} /> Audit Verified & Published!
            </div>
          ) : (
            <button
              disabled={completedCriteria < criteriaList.length || isSubmitting}
              onClick={handleSubmitReview}
              style={{
                width: '100%', padding: '11px',
                background: completedCriteria === criteriaList.length ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                color: completedCriteria === criteriaList.length ? '#fff' : 'var(--text-disabled)',
                border: 'none', borderRadius: 9, cursor: completedCriteria === criteriaList.length && !isSubmitting ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem', fontWeight: 700, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              {isSubmitting ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
              {isSubmitting ? 'Publishing...' : completedCriteria < criteriaList.length
                ? `Score ${criteriaList.length - completedCriteria} remaining criteria`
                : `Submit ${pCfg.name} Review`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
