import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Trash2,
  Archive,
  RefreshCw,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { jobService } from '../../services/job.service';
import { assessmentService } from '../../services/assessment.service';
import type { JobDependencyInfo, AssessmentDependencyInfo } from '../../types/api';

interface SafeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'job' | 'assessment';
  entityId: string;
  entityTitle: string;
  initialStatus?: string;
  onSuccess: (action: 'DELETED' | 'ARCHIVED' | 'RESTORED') => void;
}

export const SafeDeleteModal: React.FC<SafeDeleteModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityTitle,
  initialStatus,
  onSuccess,
}) => {
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [depInfo, setDepInfo] = useState<JobDependencyInfo | AssessmentDependencyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');

  useEffect(() => {
    if (isOpen && entityId) {
      loadDependencies();
    } else {
      setDepInfo(null);
      setError(null);
      setArchiveReason('');
    }
  }, [isOpen, entityId, entityType]);

  const loadDependencies = async () => {
    setLoadingDeps(true);
    setError(null);
    try {
      if (entityType === 'job') {
        const data = await jobService.getJobDependencies(entityId);
        setDepInfo(data);
      } else {
        const data = await assessmentService.getAssessmentDependencies(entityId);
        setDepInfo(data);
      }
    } catch (err: any) {
      console.error('Error fetching dependencies:', err);
      setError(err.message || 'Unable to inspect dependency graph.');
    } finally {
      setLoadingDeps(false);
    }
  };

  if (!isOpen) return null;

  const isJob = entityType === 'job';
  const jobDeps = isJob ? (depInfo as JobDependencyInfo)?.dependencies : null;
  const assessmentDeps = !isJob ? (depInfo as AssessmentDependencyInfo)?.dependencies : null;

  const canHardDelete = depInfo?.canHardDelete ?? false;
  const isArchived = (initialStatus || depInfo?.status) === 'ARCHIVED';

  const handleExecuteHardDelete = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (isJob) {
        await jobService.deleteJob(entityId);
      } else {
        await assessmentService.deleteAssessment(entityId);
      }
      onSuccess('DELETED');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecuteArchive = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (isJob) {
        await jobService.archiveJob(entityId, archiveReason);
      } else {
        await assessmentService.archiveAssessment(entityId, archiveReason);
      }
      onSuccess('ARCHIVED');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to archive record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecuteRestore = async () => {
    if (!isJob) return;
    setSubmitting(true);
    setError(null);
    try {
      await jobService.restoreJob(entityId);
      onSuccess('RESTORED');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to unarchive job.');
    } finally {
      setSubmitting(false);
    }
  };

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
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 18,
          maxWidth: 540,
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
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
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: canHardDelete ? '#dc262615' : '#d9770615',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: canHardDelete ? '#dc2626' : '#d97706',
              }}
            >
              {canHardDelete ? <Trash2 size={18} /> : <Archive size={18} />}
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: canHardDelete ? '#dc2626' : '#d97706',
                }}
              >
                {canHardDelete ? 'Permanent Deletion' : isArchived ? 'Archived Record' : 'Safe Archival'}
              </div>
              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {canHardDelete
                  ? `Delete Draft ${isJob ? 'Job' : 'Assessment'}?`
                  : isArchived
                  ? `Manage Archived ${isJob ? 'Job' : 'Assessment'}`
                  : `Archive ${isJob ? 'Job' : 'Assessment'}?`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Target Entity Overview */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target {isJob ? 'Requisition' : 'Assessment'}
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {entityTitle}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: 10 }}>
              <span>ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{entityId}</code></span>
              <span>Status: <strong>{depInfo?.status || initialStatus || 'Loading...'}</strong></span>
            </div>
          </div>

          {/* Loading Dependency Graph */}
          {loadingDeps ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '2rem 0', color: 'var(--text-muted)' }}>
              <RefreshCw size={18} className="animate-spin" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Inspecting dependency graph & candidate history...</span>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '12px 14px',
                background: '#dc262612',
                border: '1px solid #dc262630',
                borderRadius: 10,
                color: '#dc2626',
                fontSize: '0.8125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                <AlertTriangle size={15} />
                <span>Action Blocked</span>
              </div>
              <div>{error}</div>
              <button
                onClick={loadDependencies}
                style={{
                  alignSelf: 'flex-start',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid #dc262640',
                  background: 'transparent',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Dependency Counts Breakdown */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="var(--accent-primary)" />
                  <span>Real Backend Dependency Audit:</span>
                </div>

                {isJob && jobDeps && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: jobDeps.applicationsCount > 0 ? '#d97706' : 'var(--text-main)' }}>
                        {jobDeps.applicationsCount}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Applications</div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: jobDeps.assessmentAttemptsCount > 0 ? '#d97706' : 'var(--text-main)' }}>
                        {jobDeps.assessmentAttemptsCount}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Candidate Attempts</div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: jobDeps.interviewsCount > 0 ? '#d97706' : 'var(--text-main)' }}>
                        {jobDeps.interviewsCount}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Interviews</div>
                    </div>
                  </div>
                )}

                {!isJob && assessmentDeps && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: assessmentDeps.attemptsCount > 0 ? '#d97706' : 'var(--text-main)' }}>
                        {assessmentDeps.attemptsCount}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Candidate Submissions</div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: assessmentDeps.jobApplicationsCount > 0 ? '#d97706' : 'var(--text-main)' }}>
                        {assessmentDeps.jobApplicationsCount}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Linked Applications</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blocking Reasons or Explanation */}
              {canHardDelete ? (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#dc26260a',
                    border: '1px solid #dc262625',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: '#dc2626' }}>Eligible for permanent deletion:</strong> No candidate applications or verified attempts are linked to this draft. Permanently deleting will remove the record completely from the database. This action cannot be reversed.
                </div>
              ) : isArchived ? (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  This record is currently <strong>ARCHIVED</strong>. Candidate evidence, evaluations, and submission histories remain safely preserved in read-only audit status.
                </div>
              ) : (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#d977060e',
                    border: '1px solid #d9770630',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#d97706', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={15} />
                    <span>Permanent delete is blocked by system governance:</span>
                  </div>
                  {depInfo?.blockingReasons?.map((reason, i) => (
                    <div key={i} style={{ marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ color: '#d97706' }}>•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #d9770630', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Archiving this record will immediately stop new candidate submissions while preserving all candidate portfolios, submissions, reviewer audits, and evaluations intact.
                  </div>
                </div>
              )}

              {/* Archive Reason Input */}
              {!canHardDelete && !isArchived && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Archive Reason (Recorded in Immutable Audit Log):
                  </label>
                  <input
                    type="text"
                    value={archiveReason}
                    onChange={e => setArchiveReason(e.target.value)}
                    placeholder="e.g., Position filled, requisition paused, or retiring syllabus"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          {canHardDelete ? (
            <button
              onClick={handleExecuteHardDelete}
              disabled={submitting || loadingDeps}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: submitting || loadingDeps ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
              <span>{submitting ? 'Deleting Draft...' : `Delete Draft ${isJob ? 'Job' : 'Assessment'}`}</span>
            </button>
          ) : isArchived ? (
            isJob && (
              <button
                onClick={handleExecuteRestore}
                disabled={submitting || loadingDeps}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: submitting || loadingDeps ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                <span>{submitting ? 'Restoring...' : 'Restore Requisition'}</span>
              </button>
            )
          ) : (
            <button
              onClick={handleExecuteArchive}
              disabled={submitting || loadingDeps}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: '#d97706',
                color: '#fff',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: submitting || loadingDeps ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Archive size={14} />}
              <span>{submitting ? 'Archiving...' : `Archive ${isJob ? 'Job' : 'Assessment'}`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
