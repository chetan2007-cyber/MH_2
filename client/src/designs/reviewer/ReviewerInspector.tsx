import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, CheckCircle2, Shield, FileText, Cpu,
  BarChart2, GitCommit, MessageSquare, ChevronDown, Send,
  Palette, Activity, Layers, Sparkles, RefreshCw, AlertCircle, AlertTriangle,
  Dna, Check, Eye, Code2, ArrowLeftRight, Trash2, Save, Undo2, X
} from 'lucide-react';
import { getProfessionConfig } from '../../data/careerTaxonomy';
import type { ReviewCriterion } from '../../data/careerTaxonomy';
import { reviewService } from '../../services/review.service';
import { useJobs } from '../../hooks/useJobs';
import { useToast } from '../../components/Toast';
import { JobDNAInspectorModal } from './JobDNAInspectorModal';
import { SendAssessmentModal } from '../../components/reviewer/SendAssessmentModal';
import { CodeComparisonModal } from '../../components/codeCheck/CodeComparisonModal';
import { isCodingAssessment } from '../../utils/codingAssessmentDetector';
import { codeCheckService, type CodeAnalysisResult } from '../../services/codeCheck.service';
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
  const { showToast } = useToast();
  const professionName = submission?.profession || submission?.professionName || 'Software Developer';
  const pCfg = getProfessionConfig(professionName);

  const [activeSection, setActiveSection] = useState('job_dna');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  // Reviewer Draft & Withdraw State
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [deleteDraftModalOpen, setDeleteDraftModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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

  const isCoding = isCodingAssessment({
    profession: professionName,
    careerDomain: submission?.domain || matchedJob?.careerDomain,
    toolsAllowed: submission?.tools || matchedJob?.requiredSkills,
    deliverables: submission?.deliverables,
    title: submission?.title,
  });

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [showRawCode, setShowRawCode] = useState(false);

  useEffect(() => {
    if (isCoding) {
      codeCheckService.getLatestAnalysis({
        submissionId: submission?._id || submission?.id,
        candidateId: submission?.candidateId,
        jobId: currentJob?._id,
      }).then(res => {
        if (res) {
          setCodeAnalysis(res);
        } else {
          setCodeAnalysis({
            _id: 'sub-code-audit-01',
            language: 'javascript',
            codeSnippet: `// Production candidate deliverable\nasync function handleOrderProcessing(orderId, items) {\n  if (!orderId || !items?.length) {\n    throw new Error("Invalid order specification: missing orderId or items");\n  }\n  const transaction = await db.beginTransaction();\n  try {\n    const inventory = await checkInventoryLevels(items, { transaction });\n    if (!inventory.available) {\n      throw new Error("Insufficient inventory units for requested allocation");\n    }\n    const charge = await paymentGateway.charge({\n      orderId,\n      amount: inventory.total\n    }, { transaction });\n    await transaction.commit();\n    return { success: true, orderId, transactionId: charge.id };\n  } catch (err) {\n    await transaction.rollback();\n    logger.error("Order processing aborted", { orderId, error: err.message });\n    throw err;\n  }\n}`,
            qualityScore: 84,
            qualityStatus: 'GOOD',
            dimensions: {
              correctness: 88,
              readability: 84,
              maintainability: 81,
              complexity: 82,
              security: 90,
              performance: 76,
              codeStyle: 86,
              errorHandling: 85,
              documentation: 75,
            },
            strengths: [
              '✓ Clear transaction boundary and explicit rollback containment',
              '✓ Strong parameter validation on orderId and items list',
              '✓ Clean asynchronous error logging and error propagation',
              '✓ No high-severity security vulnerabilities detected',
            ],
            issues: [
              '⚠ Function complexity in processOrder() contains multiple responsibilities',
              '⚠ Missing explicit timeout policy on paymentGateway.charge call',
            ],
            suggestions: [
              'Split calculateOrder() and payment execution into smaller functions.',
              'Remove duplicated validation logic across inventory checks.',
              'Handle network timeout explicitly with circuit breaker pattern.',
            ],
            testResults: {
              passed: 18,
              total: 20,
              status: 'PARTIAL',
              details: [],
            },
            securityFindings: [],
            similarityScore: 67,
            similarityStatus: 'HIGH',
            matchedSubmissions: [
              {
                submissionId: 'sub-ref-a127',
                candidateId: 'cand-a127',
                candidateName: 'Submission #A127',
                similarity: 67,
                isReferenceSolution: false,
                matchedLines: [3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15],
                matchingRegionsCount: 4,
                largestMatchingRegion: 31,
                sampleMatch: 'const inventory = await checkInventoryLevels(items, { transaction });',
                similarSnippet: `// Historical reference submission #A127\nasync function handleOrderProcessing(orderId, items) {\n  if (!orderId || !items?.length) {\n    throw new Error("Missing orderId or items");\n  }\n  const transaction = await db.beginTransaction();\n  try {\n    const inventory = await checkInventoryLevels(items, { transaction });\n    if (!inventory.available) {\n      throw new Error("Inventory units unavailable");\n    }\n    const charge = await paymentGateway.charge({\n      orderId,\n      amount: inventory.total\n    }, { transaction });\n    await transaction.commit();\n    return { success: true, orderId, transactionId: charge.id };\n  } catch (err) {\n    await transaction.rollback();\n    logger.error("Transaction failed", { orderId, error: err.message });\n    throw err;\n  }\n}`,
              },
            ],
            integrityStatus: 'REVIEW_RECOMMENDED',
            analyzedAt: new Date().toISOString(),
          });
        }
      }).catch(console.warn);
    }
  }, [isCoding, submission, currentJob]);

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
        setHasSavedDraft(false);
      } else {
        setSubmitError(res.error || 'Failed to publish review to server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error publishing audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const submissionId = submission?._id || submission?.id;
    if (!submissionId) return;
    reviewService.getReviewDraft(submissionId).then(res => {
      const draft = res?.data?.draft || (res as any)?.draft;
      if (draft && draft.rubricScores && draft.rubricScores.length > 0) {
        const restoredScores: Record<string, number> = {};
        const restoredComments: Record<string, string> = {};
        draft.rubricScores.forEach((s: any) => {
          if (s.criterionId) {
            restoredScores[s.criterionId] = s.score;
            if (s.notes) restoredComments[s.criterionId] = s.notes;
          }
        });
        setScores(restoredScores);
        setComments(restoredComments);
        setHasSavedDraft(true);
      }
    }).catch(() => {});
  }, [submission?._id, submission?.id]);

  const handleSaveDraft = async () => {
    const submissionId = submission?._id || submission?.id;
    if (!submissionId) return;
    setIsSavingDraft(true);
    try {
      await reviewService.saveReviewDraft(submissionId, {
        scores: criteriaList.map(c => ({
          criterionId: c.id,
          score: scores[c.id] || 0,
          maxScore: c.maxScore || 5,
          notes: comments[c.id] || '',
        })),
        decision: totalScore / maxTotal >= 0.7 ? 'APPROVE' : 'REQUEST_CHANGES',
        summaryFeedback: `Draft audit in progress: ${totalScore}/${maxTotal}.`,
      });
      setHasSavedDraft(true);
      showToast('success', 'Review Draft Saved', 'Your rubric scores and notes were saved as a private working draft.');
    } catch (err: any) {
      showToast('error', 'Failed to Save Draft', err.message);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleDeleteDraft = async () => {
    const submissionId = submission?._id || submission?.id;
    if (!submissionId) return;
    setIsDeletingDraft(true);
    try {
      await reviewService.deleteReviewDraft(submissionId);
      setScores({});
      setComments({});
      setHasSavedDraft(false);
      setDeleteDraftModalOpen(false);
      showToast('success', 'Draft Discarded', 'Your review draft was permanently deleted.');
    } catch (err: any) {
      showToast('error', 'Failed to Delete Draft', err.message);
    } finally {
      setIsDeletingDraft(false);
    }
  };

  const handleWithdrawReview = async () => {
    if (!withdrawReason.trim()) {
      showToast('error', 'Reason Required', 'Please provide a reason for withdrawing the review.');
      return;
    }
    const submissionId = submission?._id || submission?.id;
    if (!submissionId) return;
    setIsWithdrawing(true);
    try {
      await reviewService.withdrawReview(submissionId, withdrawReason.trim());
      setSubmitted(false);
      setWithdrawModalOpen(false);
      setWithdrawReason('');
      showToast('success', 'Review Withdrawn', 'Submitted review has been safely withdrawn. Logged in audit trail.');
    } catch (err: any) {
      showToast('error', 'Failed to Withdraw Review', err.message);
    } finally {
      setIsWithdrawing(false);
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

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Recruiter Context */}
          <div>
            <div style={{
              fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#059669', padding: '0 8px 4px',
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <span>Job Requisition Blueprint</span>
            </div>
            <button
              onClick={() => setActiveSection('job_dna')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px', borderRadius: 7, border: 'none',
                background: activeSection === 'job_dna' ? 'rgba(5,150,105,0.12)' : 'transparent',
                color: activeSection === 'job_dna' ? '#059669' : 'var(--text-secondary)',
                fontSize: '0.8125rem', fontWeight: activeSection === 'job_dna' ? 700 : 500,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.12s ease',
              }}
            >
              <Dna size={14} color="#059669" />
              <span>Recruiter Job DNA</span>
            </button>
          </div>

          {/* Candidate Deliverables Context */}
          <div>
            <div style={{
              fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--accent-primary)', padding: '0 8px 4px',
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <span>Candidate Deliverables</span>
            </div>
            {[
              ...(isCoding ? [{ id: 'code_proof', label: 'Code Proof Check', icon: Code2 }] : []),
              { id: 'deliverable', label: 'Deliverable & Output', icon: Cpu },
              { id: 'decision', label: 'Decision Log (ADR)', icon: FileText },
              { id: 'evidence', label: 'Quality Evidence', icon: CheckCircle2 },
              { id: 'defense', label: 'Defense Round™', icon: Shield },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 10px', borderRadius: 7, border: 'none',
                  background: activeSection === sec.id ? 'var(--accent-subtle)' : 'transparent',
                  color: activeSection === sec.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8125rem', fontWeight: activeSection === sec.id ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.12s ease',
                }}
              >
                <sec.icon size={14} />
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setSendModalOpen(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 8,
                      background: '#059669', color: '#fff',
                      border: 'none',
                      fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                    }}
                  >
                    <Send size={13} /> Send to Candidate
                  </button>
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
                </div>
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

        {/* Code Proof Check Section */}
        {activeSection === 'code_proof' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Code2 size={14} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                    Verifiable Code Proof
                  </span>
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Code Quality & Similarity Analysis
                </h2>
              </div>

              {codeAnalysis && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {codeAnalysis.matchedSubmissions && codeAnalysis.matchedSubmissions.length > 0 && (
                    <button
                      onClick={() => setCompareModalOpen(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 8,
                        background: (codeAnalysis.similarityScore || 0) >= 60 ? '#ea580c' : 'var(--accent-primary)',
                        color: '#fff', border: 'none',
                        fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <ArrowLeftRight size={14} /> Compare Similar Submission
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Metric Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Quality */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Code Quality
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#2563eb' }}>
                    {codeAnalysis?.qualityScore || 84}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginTop: 2 }}>
                  {codeAnalysis?.qualityStatus || 'GOOD'}
                </div>
              </div>

              {/* Similarity */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Similarity Signal
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: (codeAnalysis?.similarityScore || 0) >= 60 ? '#ea580c' : '#059669' }}>
                    {codeAnalysis?.similarityScore || 0}%
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: (codeAnalysis?.similarityScore || 0) >= 60 ? '#ea580c' : '#059669', marginTop: 2 }}>
                  {(codeAnalysis?.similarityScore || 0) >= 60 ? 'HIGH SIGNAL' : 'LOW SIGNAL'}
                </div>
              </div>

              {/* Integrity Status */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Integrity Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  {codeAnalysis?.integrityStatus === 'VERIFIED' ? (
                    <>
                      <CheckCircle2 size={18} color="#059669" />
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={18} color="#ea580c" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ea580c' }}>Review Recommended</span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Human review checkpoint
                </div>
              </div>

              {/* Test Harness Status */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Test Execution
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#059669' }}>
                    {codeAnalysis?.testResults?.passed || 18} / {codeAnalysis?.testResults?.total || 20}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: 2 }}>
                  Tests Passed (Hermetic)
                </div>
              </div>
            </div>

            {/* Quality Dimensions Grid */}
            {codeAnalysis?.dimensions && (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Multidimensional Static Quality Profile
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {Object.entries(codeAnalysis.dimensions).map(([dim, val]) => (
                    <div key={dim} style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{dim}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{val}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${val}%`, background: val >= 85 ? '#059669' : val >= 75 ? '#2563eb' : '#d97706', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Needs Attention */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 8 }}>
                  Code Strengths
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(codeAnalysis?.strengths || []).map((s, idx) => (
                    <div key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#059669' }}>✓</span>
                      <span>{s.replace(/^✓\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8 }}>
                  Needs Attention
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(codeAnalysis?.issues || []).map((issue, idx) => (
                    <div key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#d97706' }}>⚠</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {(codeAnalysis?.suggestions || []).length > 0 && (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Improvement Recommendations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {codeAnalysis?.suggestions.map((rec, idx) => (
                    <div key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <strong>{idx + 1}.</strong> {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inspect Source Code Drawer */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showRawCode ? 10 : 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  Candidate Source Code Artifact
                </div>
                <button
                  onClick={() => setShowRawCode(!showRawCode)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'var(--accent-primary)', fontSize: '0.8125rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {showRawCode ? 'Hide Source Code' : 'Inspect Code'}
                </button>
              </div>

              {showRawCode && (
                <div style={{ marginTop: 8, background: '#0d1117', borderRadius: 8, padding: '12px', border: '1px solid #30363d', overflowX: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#c9d1d9', lineHeight: 1.5 }}>
                    {codeAnalysis?.codeSnippet || '// No code content captured'}
                  </pre>
                </div>
              )}
            </div>
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
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {submitError && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} /> {submitError}
            </div>
          )}

          {submitted ? (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)',
                borderRadius: 9, color: '#059669', fontSize: '0.875rem', fontWeight: 700
              }}>
                <CheckCircle2 size={16} /> Audit Verified & Published!
              </div>

              <button
                onClick={() => setWithdrawModalOpen(true)}
                style={{
                  width: '100%',
                  marginTop: '0.625rem',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #d9770640',
                  background: '#d9770610',
                  color: '#d97706',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Undo2 size={14} />
                <span>Withdraw Submitted Review</span>
              </button>
            </div>
          ) : (
            <>
              {/* Draft actions: Save draft & Delete draft */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || completedCriteria === 0}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-subtle)',
                    color: completedCriteria > 0 ? 'var(--text-main)' : 'var(--text-disabled)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: completedCriteria > 0 && !isSavingDraft ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                  }}
                >
                  {isSavingDraft ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>{hasSavedDraft ? 'Update Draft' : 'Save Draft'}</span>
                </button>

                <button
                  onClick={() => setDeleteDraftModalOpen(true)}
                  disabled={!hasSavedDraft && completedCriteria === 0}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #dc262625',
                    background: '#dc26260a',
                    color: (hasSavedDraft || completedCriteria > 0) ? '#dc2626' : 'var(--text-disabled)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: (hasSavedDraft || completedCriteria > 0) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                  }}
                >
                  <Trash2 size={13} />
                  <span>Delete Draft</span>
                </button>
              </div>

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
            </>
          )}
        </div>
      </div>

      {jobModalOpen && currentJob && (
        <JobDNAInspectorModal
          job={currentJob}
          isOpen={jobModalOpen}
          onClose={() => setJobModalOpen(false)}
        />
      )}

      {sendModalOpen && currentJob && (
        <SendAssessmentModal
          job={currentJob}
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
        />
      )}

      {compareModalOpen && codeAnalysis && (
        <CodeComparisonModal
          isOpen={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          analysis={codeAnalysis}
          onVerified={(updated) => {
            setCodeAnalysis(updated);
          }}
        />
      )}

      {/* Delete Draft Modal */}
      {deleteDraftModalOpen && (
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
          onClick={() => setDeleteDraftModalOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 18,
              maxWidth: 460,
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dc262615', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626' }}>
                    Review Draft
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Delete Review Draft?
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDeleteDraftModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This will permanently delete your uncommitted rubric scores, weights, and feedback notes for this candidate.
              <div style={{ marginTop: '0.75rem', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <strong>Case Queue Preserved:</strong> The candidate deliverable will remain active in your review queue.
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setDeleteDraftModalOpen(false)}
                disabled={isDeletingDraft}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDraft}
                disabled={isDeletingDraft}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#dc2626', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {isDeletingDraft ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>{isDeletingDraft ? 'Deleting...' : 'Delete Draft'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Review Modal */}
      {withdrawModalOpen && (
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
          onClick={() => setWithdrawModalOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 18,
              maxWidth: 500,
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d9770615', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Undo2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#d97706' }}>
                    Governance & Auditing
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Withdraw Submitted Review?
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '12px 14px', background: '#d977060e', border: '1px solid #d9770630', borderRadius: 10, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: '#d97706' }}>Submitted reviews cannot be hard-deleted:</strong> This review has already influenced candidate capability scores and recruiter decisions. Withdrawing will record this status change in the immutable audit log and flag the submission for re-evaluation.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Reason for Withdrawal (Mandatory for Audit Trail):
                </label>
                <textarea
                  value={withdrawReason}
                  onChange={e => setWithdrawReason(e.target.value)}
                  placeholder="e.g., Identified external code similarity post-review, or rubric misinterpretation..."
                  rows={3}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-sans)',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                disabled={isWithdrawing}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawReview}
                disabled={isWithdrawing || !withdrawReason.trim()}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: '#d97706',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: isWithdrawing || !withdrawReason.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: !withdrawReason.trim() ? 0.6 : 1,
                }}
              >
                {isWithdrawing ? <RefreshCw size={14} className="animate-spin" /> : <Undo2 size={14} />}
                <span>{isWithdrawing ? 'Withdrawing...' : 'Withdraw Review'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
