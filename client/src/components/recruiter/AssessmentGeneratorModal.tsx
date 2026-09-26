import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, Check, Shield, FileText, CheckCircle2, Clock,
  Layers, ArrowRight, Eye, Copy, Users, CheckCircle, Hourglass
} from 'lucide-react';
import { assessmentService } from '../../services/assessment.service';
import { applicationService } from '../../services/application.service';
import { CandidateAssessmentModal } from '../candidate/CandidateAssessmentModal';
import { useToast } from '../Toast';
import type { Job, Assessment } from '../../types/api';

interface AssessmentGeneratorModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (publishedAssessment: Assessment) => void;
}

export const AssessmentGeneratorModal: React.FC<AssessmentGeneratorModalProps> = ({
  job,
  isOpen,
  onClose,
  onPublished,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    assignedCount: 0,
    completedCount: 0,
    pendingCount: 0,
  });

  useEffect(() => {
    if (isOpen && job._id) {
      loadAssessments();
      loadStats();
    }
  }, [isOpen, job._id]);

  const loadStats = async () => {
    try {
      const data = await applicationService.getAssessmentStatsByJob(job._id);
      setStats(data);
    } catch (err) {
      console.error('Failed to load assessment stats:', err);
    }
  };

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const list = await assessmentService.getAssessmentsByJob(job._id);
      setAssessments(list);
      if (list.length > 0) {
        setActiveAssessment(list[0]);
      } else {
        // Auto-generate v1 if none exists
        handleGenerateNew();
      }
    } catch (err: any) {
      showToast('error', 'Failed to load assessments', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    setLoading(true);
    try {
      const generated = await assessmentService.generateAssessment(job._id);
      setAssessments(prev => [generated, ...prev]);
      setActiveAssessment(generated);
      showToast('success', 'AI Assessment Generated', `Version ${generated.version} drafted from Job DNA.`);
    } catch (err: any) {
      showToast('error', 'Generation Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!activeAssessment) return;
    setPublishing(true);
    try {
      const published = await assessmentService.publishAssessment(activeAssessment._id);
      setActiveAssessment(published);
      setAssessments(prev => prev.map(a => (a._id === published._id ? published : a)));
      showToast('success', 'Assessment Published', `Version ${published.version} is now live for candidates.`);
      loadStats();
      if (onPublished) onPublished(published);
    } catch (err: any) {
      showToast('error', 'Publish Failed', err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyJobLink = () => {
    const url = `${window.location.origin}/?jobId=${job._id}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Job Assessment Link Copied', 'Direct candidate application URL copied to clipboard.');
  };

  if (!isOpen) return null;

  return (
    <>
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
            maxWidth: 980,
            width: '100%',
            maxHeight: '92vh',
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
                  AI Assessment Generator & Version Control
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                {job.title}
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

          {/* Live Delivery Status Bar for Published Assessment */}
          {activeAssessment?.status === 'PUBLISHED' && (
            <div
              style={{
                background: 'rgba(5,150,105,0.06)',
                borderBottom: '1px solid rgba(5,150,105,0.18)',
                padding: '0.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>
                  <CheckCircle2 size={14} /> Published & Live
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Assessment: <strong>Version {activeAssessment.version}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Duration: <strong>{activeAssessment.timeLimitMinutes} min</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={13} color="var(--accent-primary)" />
                  Assigned: <strong style={{ color: 'var(--text-main)' }}>{stats.assignedCount}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={13} color="#059669" />
                  Completed: <strong style={{ color: 'var(--text-main)' }}>{stats.completedCount}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Hourglass size={13} color="#d97706" />
                  Pending: <strong style={{ color: 'var(--text-main)' }}>{stats.pendingCount}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Content with Version Sidebar + Assessment Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', flex: 1, overflow: 'hidden' }}>
            {/* Version Sidebar */}
            <div
              style={{
                borderRight: '1px solid var(--border-subtle)',
                background: 'var(--bg-app)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                Assessment Versions
              </div>

              {assessments.map(a => {
                const isSelected = activeAssessment?._id === a._id;
                const isPublished = a.status === 'PUBLISHED';

                return (
                  <button
                    key={a._id}
                    onClick={() => setActiveAssessment(a)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'var(--bg-surface)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                        Version {a.version}
                      </span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: isPublished ? '#05966914' : 'var(--bg-subtle)',
                          color: isPublished ? '#059669' : 'var(--text-muted)',
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {a.timeLimitMinutes} mins · {a.difficulty}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={handleGenerateNew}
                disabled={loading}
                style={{
                  marginTop: 'auto',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px dashed var(--border-medium)',
                  background: 'transparent',
                  color: 'var(--accent-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={12} />
                <span>Draft New Version</span>
              </button>
            </div>

            {/* Assessment Preview */}
            <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeAssessment ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                        {activeAssessment.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {activeAssessment.timeLimitMinutes} Minutes
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Shield size={12} /> {activeAssessment.difficulty} Tier
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => setPreviewOpen(true)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Eye size={13} />
                        <span>Preview as Candidate</span>
                      </button>

                      {activeAssessment.status === 'PUBLISHED' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#05966914', padding: '6px 12px', borderRadius: 8 }}>
                          <CheckCircle2 size={14} /> Published & Live
                        </span>
                      ) : (
                        <button
                          onClick={handlePublish}
                          disabled={publishing}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            background: '#059669',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Check size={14} />
                          {publishing ? 'Publishing...' : 'Approve & Publish'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scenario & Practical Task */}
                  <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
                      Realistic Production Scenario
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                      {activeAssessment.scenario}
                    </p>

                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
                      Practical Deliverable Task
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      {activeAssessment.practicalTask}
                    </p>
                  </div>

                  {/* Constraints & Deliverables Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: 8 }}>
                        Hard Constraints:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {activeAssessment.constraints?.map((c, i) => (
                          <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#dc2626' }} />
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: 8 }}>
                        Expected Deliverables:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {activeAssessment.deliverables?.map((d, i) => (
                          <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FileText size={12} color="var(--accent-primary)" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rubric Criteria */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Structured AI Evaluation Rubric
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                      {activeAssessment.rubricCriteria?.map(rc => (
                        <div
                          key={rc.id}
                          style={{
                            padding: '10px 12px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 8,
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {rc.label}
                            </span>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                              Weight: {rc.weight}%
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {rc.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  {loading ? 'Drafting AI Assessment...' : 'Select or generate an assessment version.'}
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
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={handleCopyJobLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Copy size={13} />
              <span>Copy Job Assessment Link</span>
            </button>

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

      {/* Candidate Experience Preview Modal */}
      {previewOpen && activeAssessment && (
        <CandidateAssessmentModal
          applicationId=""
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          previewMode={true}
          previewAssessment={activeAssessment}
        />
      )}
    </>
  );
};

