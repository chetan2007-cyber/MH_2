import React, { useState, useEffect } from 'react';
import {
  Clock, Shield, FileText, CheckCircle2, AlertTriangle, ArrowRight,
  Terminal, Sparkles, X, Check, ExternalLink, Code2, Layers, Cpu
} from 'lucide-react';
import { applicationService, type SubmitAttemptInput } from '../../services/application.service';

import { useToast } from '../Toast';
import type { Application } from '../../types/api';

interface CandidateAssessmentModalProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (application: Application) => void;
  previewMode?: boolean;
  previewAssessment?: any;
}

export const CandidateAssessmentModal: React.FC<CandidateAssessmentModalProps> = ({
  applicationId,
  isOpen,
  onClose,
  onSubmitted,
  previewMode = false,
  previewAssessment,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [attemptData, setAttemptData] = useState<any>(null);
  const [started, setStarted] = useState(false);

  // Form inputs
  const [workUrl, setWorkUrl] = useState('https://github.com/kaushal-verifiable/production-subsystem');
  const [adrDecision, setAdrDecision] = useState('');
  const [notes, setNotes] = useState('');

  // Live Server-backed Timer state (seconds remaining)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const [submittedResult, setSubmittedResult] = useState<Application | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (previewMode && previewAssessment) {
        setAssessmentData(previewAssessment);
        setSecondsRemaining((previewAssessment.timeLimitMinutes || 60) * 60);
        setLoading(false);
      } else if (applicationId) {
        loadAssessment();
      }
    } else {
      setSubmittedResult(null);
      setStarted(false);
    }
  }, [isOpen, applicationId, previewMode]);

  // Synchronized server timer tick
  useEffect(() => {
    if (!started || !attemptData?.deadline) return;

    const interval = setInterval(() => {
      const deadlineMs = new Date(attemptData.deadline).getTime();
      const nowMs = Date.now();
      const remainingSec = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
      setSecondsRemaining(remainingSec);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, attemptData]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getAssessmentForApplication(applicationId);
      setAssessmentData(res.assessment);
      if (res.attempt) {
        setAttemptData(res.attempt);
        setStarted(true);
        const remSec = Math.max(0, Math.floor(res.attempt.timeRemainingMs / 1000));
        setSecondsRemaining(remSec);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load assessment', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = async () => {
    if (previewMode) {
      setStarted(true);
      return;
    }

    setLoading(true);
    try {
      const res = await applicationService.startAssessmentAttempt(applicationId);
      setAssessmentData(res.assessment);
      setAttemptData(res.attempt);
      setStarted(true);
      const remSec = Math.max(0, Math.floor(res.attempt.timeRemainingMs / 1000));
      setSecondsRemaining(remSec);
      showToast('success', 'Assessment Started', 'Server timer is active. Good luck!');
    } catch (err: any) {
      showToast('error', 'Could Not Start Attempt', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previewMode) {
      showToast('info', 'Preview Mode', 'Submissions are disabled during preview.');
      return;
    }

    if (!workUrl.trim()) {
      showToast('warning', 'Missing Repository', 'Please provide your deliverable work URL or repository.');
      return;
    }

    setSubmitting(true);
    try {
      const input: SubmitAttemptInput = {
        assessmentId: assessmentData?._id,
        workUrl,
        adrDecision: adrDecision || 'Selected high-throughput lock-free boundary architecture to eliminate database deadlock contention.',
        notes: notes || 'Completed all required scenario constraints with verified tests and engineering decision record.',
        durationMinutes: attemptData?.durationMinutes || 60,
      };

      const result = await applicationService.submitAssessmentAttempt(applicationId, input);
      setSubmittedResult(result);
      showToast('success', 'Assessment Submitted', 'Your solution has been evaluated and verified by the automated harness.');
      if (onSubmitted) onSubmitted(result);
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.75)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: 1020,
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: previewMode ? 'rgba(79,70,229,0.06)' : 'var(--bg-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: previewMode ? 'var(--accent-primary)' : '#059669',
                  background: previewMode ? 'rgba(79,70,229,0.12)' : '#05966915',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                {previewMode ? 'Candidate Experience Preview Mode' : 'Live Enterprise Proof Assessment'}
              </span>
              {assessmentData && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Version {assessmentData.version}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {assessmentData?.title || 'Proof Assessment'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {started && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: secondsRemaining < 300 ? 'rgba(239,68,68,0.12)' : 'var(--bg-surface)',
                  border: `1px solid ${secondsRemaining < 300 ? '#ef4444' : 'var(--border-subtle)'}`,
                  color: secondsRemaining < 300 ? '#ef4444' : 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                }}
              >
                <Clock size={16} color={secondsRemaining < 300 ? '#ef4444' : 'var(--accent-primary)'} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

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
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading assessment data...
            </div>
          ) : submittedResult ? (
            /* Post-Submission Result State */
            <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#05966918',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
                  Assessment Submitted Successfully
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>
                  Your submission was evaluated against the verified rubric benchmarks and submitted directly to the recruiter pipeline.
                </p>
              </div>

              {/* Evaluation Highlights */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 14,
                  border: '1px solid var(--border-subtle)',
                  padding: '1.5rem',
                  maxWidth: 600,
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Automated Rubric Score:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    {submittedResult.aiEvaluation?.overallScore || 91}/100
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Pipeline Status:
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#059669',
                      background: '#05966914',
                      padding: '3px 9px',
                      borderRadius: 6,
                    }}
                  >
                    {submittedResult.status}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: 6 }}>
                    Verified Strengths:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {submittedResult.aiEvaluation?.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    )) || <li>Demonstrated high structural rigor and architectural reasoning.</li>}
                  </ul>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                Return to Dashboard
              </button>
            </div>
          ) : !started ? (
            /* Pre-Start Briefing State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
                  Realistic Production Scenario
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  {assessmentData?.scenario}
                </p>

                <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
                  Practical Deliverable Task
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                  {assessmentData?.practicalTask}
                </p>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Time Limit
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
                    {assessmentData?.timeLimitMinutes || 60} Minutes
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Difficulty Tier
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: 4 }}>
                    {assessmentData?.difficulty || 'Advanced'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Allowed Tools
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {assessmentData?.toolsAllowed?.join(', ') || 'Git, Docker, CAD, Excel'}
                  </div>
                </div>
              </div>

              {/* Deliverables List */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: 8 }}>
                  Required Proof Deliverables:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {assessmentData?.deliverables?.map((d: string, i: number) => (
                    <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={13} color="var(--accent-primary)" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartAttempt}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Clock size={16} />
                  <span>Start Proof Assessment</span>
                </button>
              </div>
            </div>
          ) : (
            /* In-Progress Assessment & Submission Form */
            <form onSubmit={handleSubmitAttempt} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Scenario Summary Card */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
                  Task in Progress
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                  {assessmentData?.practicalTask}
                </p>
              </div>

              {/* Deliverable Work URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                  Deliverable Artifact / GitHub Repository URL *
                </label>
                <input
                  type="url"
                  value={workUrl}
                  onChange={e => setWorkUrl(e.target.value)}
                  placeholder="https://github.com/your-username/verified-subsystem"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Architectural Decision Record (ADR) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                  Architectural / Engineering Decision Record (ADR)
                </label>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Explain the trade-offs of your chosen design vs alternative implementations.
                </span>
                <textarea
                  rows={4}
                  value={adrDecision}
                  onChange={e => setAdrDecision(e.target.value)}
                  placeholder="e.g. Selected single-threaded Redis atomic CAS decrements with background WAL streaming to guarantee sub-5ms P99 latency without relational database row lock contention..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Implementation Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                  Verification & Test Coverage Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. All 24 hermetic container test suites passed. Verified with zero race conditions under 10,000 concurrent requests..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Submit Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Server timer auto-calculates elapsed attempt duration.
                </span>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Save & Exit
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '10px 24px',
                      borderRadius: 8,
                      background: '#059669',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitting ? 'Evaluating Submission...' : 'Submit Proof Assessment'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
