import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, X, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { interviewService } from '../../services/interview.service';
import { useToast } from '../Toast';
import type { Application, Interview, GeneratedInterviewQuestion, ScorecardCriterion } from '../../types/api';

interface InterviewGeneratorModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: (interview: Interview) => void;
}

export const InterviewGeneratorModal: React.FC<InterviewGeneratorModalProps> = ({
  application,
  isOpen,
  onClose,
  onScheduled,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [savingScorecard, setSavingScorecard] = useState(false);
  const [questions, setQuestions] = useState<GeneratedInterviewQuestion[]>([]);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );

  // Scorecard state
  const [scorecard, setScorecard] = useState<ScorecardCriterion[]>([
    { criterionId: 'tech_depth', label: 'Technical Depth & Domain Rigor', score: 4, notes: '' },
    { criterionId: 'prob_solving', label: 'Practical Problem Solving & Trade-offs', score: 4, notes: '' },
    { criterionId: 'communication', label: 'Technical Conviction & Clarity', score: 4, notes: '' },
    { criterionId: 'role_fit', label: 'Role Alignment & Scalability', score: 4, notes: '' },
  ]);
  const [recommendation, setRecommendation] = useState<'STRONG_YES' | 'YES' | 'NEUTRAL' | 'NO' | 'STRONG_NO'>('YES');
  const [interviewerNotes, setInterviewerNotes] = useState('');

  useEffect(() => {
    if (isOpen && application._id) {
      loadInterviewOrQuestions();
    }
  }, [isOpen, application._id]);

  const loadInterviewOrQuestions = async () => {
    setLoading(true);
    try {
      const existing = await interviewService.getInterviewByApplication(application._id);
      if (existing) {
        setInterview(existing);
        setQuestions(existing.generatedQuestions || []);
        if (existing.scorecard && existing.scorecard.length > 0) {
          setScorecard(existing.scorecard);
        }
        if (existing.recommendation && existing.recommendation !== 'PENDING') {
          setRecommendation(existing.recommendation as any);
        }
        if (existing.interviewerNotes) {
          setInterviewerNotes(existing.interviewerNotes);
        }
      } else {
        const gen = await interviewService.generateQuestions(application._id);
        setQuestions(gen.questions);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load interview', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const scheduled = await interviewService.scheduleInterview({
        applicationId: application._id,
        scheduledAt: new Date(scheduledDate).toISOString(),
        durationMinutes: 45,
        questions,
      });
      setInterview(scheduled);
      showToast('success', 'Interview Scheduled', 'Evidence-grounded question set generated and saved.');
      if (onScheduled) onScheduled(scheduled);
    } catch (err: any) {
      showToast('error', 'Scheduling Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (index: number, score: number) => {
    const next = [...scorecard];
    next[index] = { ...next[index], score };
    setScorecard(next);
  };

  const handleScorecardSubmit = async () => {
    if (!interview) return;
    setSavingScorecard(true);
    try {
      const updated = await interviewService.submitScorecard(interview._id, {
        scorecard,
        interviewerNotes,
        recommendation,
      });
      setInterview(updated);
      showToast('success', 'Scorecard Saved', 'Interview evaluation and recommendation persisted.');
    } catch (err: any) {
      showToast('error', 'Failed to save scorecard', err.message);
    } finally {
      setSavingScorecard(false);
    }
  };

  if (!isOpen) return null;

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
          maxWidth: 920,
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
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
                Evidence-Grounded AI Interview Suite
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Technical Defense Interview: {application.candidateId?.name}
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

        {/* Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Scheduling Bar if not scheduled */}
          {!interview ? (
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Schedule Defense Round</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sets meeting time and sends candidate invite.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                  }}
                />
                <button
                  onClick={handleSchedule}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Confirm & Schedule
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px 16px', background: '#05966910', border: '1px solid #05966930', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', fontWeight: 700, color: '#059669' }}>
                <CheckCircle2 size={16} />
                <span>Interview Scheduled: {new Date(interview.scheduledAt).toLocaleString()} ({interview.status})</span>
              </div>
            </div>
          )}

          {/* Evidence-Grounded Questions */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Evidence-Grounded Defense Questions ({questions.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  style={{
                    padding: '14px 16px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 12,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {q.question}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        <span style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                          <strong>Competency:</strong> {q.competency}
                        </span>
                        {q.evidenceContext && (
                          <span style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--accent-primary)10', color: 'var(--accent-primary)' }}>
                            <strong>Evidence Context:</strong> {q.evidenceContext}
                          </span>
                        )}
                      </div>

                      {q.evaluatorFocus && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                          <strong>Evaluator Focus:</strong> {q.evaluatorFocus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Interview Scorecard */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)' }}>
                  Interviewer Scorecard & Evaluation
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Record ratings and final hiring recommendation.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {scorecard.map((item, i) => (
                <div key={item.criterionId} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                    {item.label}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleScoreChange(i, star)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: `1px solid ${item.score >= star ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          background: item.score >= star ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                          color: item.score >= star ? '#fff' : 'var(--text-muted)',
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Hiring Recommendation
                </label>
                <select
                  value={recommendation}
                  onChange={e => setRecommendation(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  <option value="STRONG_YES">Strong Yes</option>
                  <option value="YES">Yes</option>
                  <option value="NEUTRAL">Neutral / Hold</option>
                  <option value="NO">No</option>
                  <option value="STRONG_NO">Strong No</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Interviewer Evaluation Notes
                </label>
                <textarea
                  rows={2}
                  value={interviewerNotes}
                  onChange={e => setInterviewerNotes(e.target.value)}
                  placeholder="Defended architecture and trade-offs clearly under examination..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    resize: 'none',
                  }}
                />
              </div>
            </div>

            {interview && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleScorecardSubmit}
                  disabled={savingScorecard}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 8,
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {savingScorecard ? 'Saving Scorecard...' : 'Submit & Save Scorecard'}
                </button>
              </div>
            )}
          </div>
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
              padding: '8px 18px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
