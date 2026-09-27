import React, { useState, useEffect, useRef } from 'react';
import { Plus, Dna, FileText, Sparkles, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, Layers, MoreVertical, Archive, Trash2, RotateCcw } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { jobService, type CreateJobInput } from '../../services/job.service';
import { useToast } from '../Toast';
import { JobDNAModal } from './JobDNAModal';
import { AssessmentGeneratorModal } from './AssessmentGeneratorModal';
import { SafeDeleteModal } from '../common/SafeDeleteModal';
import type { Job } from '../../types/api';

export const JobRequisitionsView: React.FC = () => {
  const { showToast } = useToast();
  const { jobs, loading, error, refetch } = useJobs();

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [dnaJob, setDnaJob] = useState<Job | null>(null);
  const [assessmentJob, setAssessmentJob] = useState<Job | null>(null);
  const [deleteModalJob, setDeleteModalJob] = useState<Job | null>(null);
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState<'active' | 'archived'>('active');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuJobId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form state
  const [formData, setFormData] = useState<CreateJobInput>({
    title: '',
    department: 'Engineering',
    careerDomain: 'technology',
    profession: 'Software Developer',
    experience: '3-5 years',
    employmentType: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    description: '',
    requiredSkills: [],
    optionalSkills: [],
    difficulty: 'Advanced',
    assessmentDurationMinutes: 60,
  });
  const [skillInput, setSkillInput] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('error', 'Validation Error', 'Title and description are required.');
      return;
    }

    setCreating(true);
    try {
      const newJob = await jobService.createJob(formData);
      showToast('success', 'Job Requisition Created', `${newJob.title} is ready for Job DNA synthesis.`);
      setCreateModalOpen(false);
      refetch();
      // Prompt Job DNA
      setDnaJob(newJob);
    } catch (err: any) {
      showToast('error', 'Creation Failed', err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      requiredSkills: [...(prev.requiredSkills || []), skillInput.trim()],
    }));
    setSkillInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Layers size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
              Requisition Architecture
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
            Job Requisitions & Competency Models
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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

          <button
            onClick={() => setCreateModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={16} />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#dc262614', border: '1px solid #dc262630', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Requisitions Tabs: Active vs Archived */}
      {(() => {
        const activeJobs = jobs.filter(j => j.status !== 'ARCHIVED');
        const archivedJobs = jobs.filter(j => j.status === 'ARCHIVED');
        const displayedJobs = tabFilter === 'active' ? activeJobs : archivedJobs;

        return (
          <>
            <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
              <button
                onClick={() => setTabFilter('active')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: tabFilter === 'active' ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                  color: tabFilter === 'active' ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Active Requisitions ({activeJobs.length})
              </button>
              <button
                onClick={() => setTabFilter('archived')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: tabFilter === 'archived' ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                  color: tabFilter === 'archived' ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <Archive size={13} />
                <span>Archived Requisitions ({archivedJobs.length})</span>
              </button>
            </div>

            {/* Requisitions List */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 100, background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)', opacity: 0.6 }} />
                ))}
              </div>
            ) : displayedJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
                {tabFilter === 'archived' ? (
                  <>
                    <Archive size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                      No Archived Requisitions
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0' }}>
                      Requisitions that are completed or paused can be safely archived to preserve candidate evidence.
                    </p>
                  </>
                ) : (
                  <>
                    <Layers size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                      No Active Job Requisitions
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                      Create your first job requisition to synthesize Job DNA and generate verifiable practical assessments.
                    </p>
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      style={{
                        padding: '9px 18px',
                        borderRadius: 8,
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Create Job Requisition
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {displayedJobs.map(job => {
                  const hasDNA = !!job.jobDNA;
                  const isOpen = job.status === 'OPEN';
                  const isArchived = job.status === 'ARCHIVED';

                  return (
                    <div
                      key={job._id}
                      style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 14,
                        border: isArchived ? '1px dashed var(--border-medium)' : '1px solid var(--border-subtle)',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        boxShadow: 'var(--shadow-xs)',
                        opacity: isArchived ? 0.85 : 1,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: isOpen ? '#05966914' : isArchived ? '#d9770614' : 'var(--bg-subtle)',
                              color: isOpen ? '#059669' : isArchived ? '#d97706' : 'var(--text-muted)',
                            }}
                          >
                            {job.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {job.department} · {job.careerDomain}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                          {job.title}
                        </h3>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 10px', maxWidth: 640, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.description}
                        </p>

                        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span><strong>Experience:</strong> {job.experience}</span>
                          <span><strong>Difficulty:</strong> {job.difficulty}</span>
                          <span><strong>Applicants:</strong> {job.applicantCount || 0}</span>
                          <span><strong>Shortlisted:</strong> {job.shortlistedCount || 0}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <button
                          onClick={() => setDnaJob(job)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 8,
                            border: `1px solid ${hasDNA ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                            background: hasDNA ? 'var(--accent-primary)10' : 'var(--bg-subtle)',
                            color: hasDNA ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Dna size={14} />
                          <span>{hasDNA ? 'Job DNA Ready' : 'Synthesize DNA'}</span>
                        </button>

                        <button
                          onClick={() => setAssessmentJob(job)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 8,
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-subtle)',
                            color: 'var(--text-main)',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <FileText size={14} />
                          <span>Assessments ({job.publishedAssessmentId ? 'Published' : 'Draft'})</span>
                        </button>

                        {/* Overflow Actions Menu */}
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setActiveMenuJobId(activeMenuJobId === job._id ? null : job._id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              border: '1px solid var(--border-subtle)',
                              background: 'var(--bg-subtle)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="More actions"
                          >
                            <MoreVertical size={15} />
                          </button>

                          {activeMenuJobId === job._id && (
                            <div
                              ref={menuRef}
                              style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 10,
                                boxShadow: 'var(--shadow-lg)',
                                padding: '6px',
                                minWidth: 175,
                                zIndex: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuJobId(null);
                                  setDnaJob(job);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '8px 10px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'var(--text-main)',
                                  fontSize: '0.8125rem',
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                }}
                              >
                                <Dna size={14} color="var(--accent-primary)" />
                                <span>View Job DNA</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuJobId(null);
                                  setAssessmentJob(job);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '8px 10px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'var(--text-main)',
                                  fontSize: '0.8125rem',
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                }}
                              >
                                <FileText size={14} color="var(--accent-primary)" />
                                <span>Assessments</span>
                              </button>

                              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                              {isArchived ? (
                                <button
                                  onClick={() => {
                                    setActiveMenuJobId(null);
                                    setDeleteModalJob(job);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 10px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%',
                                  }}
                                >
                                  <RotateCcw size={14} />
                                  <span>Restore Requisition</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setActiveMenuJobId(null);
                                      setDeleteModalJob(job);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      padding: '8px 10px',
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#d97706',
                                      fontSize: '0.8125rem',
                                      fontWeight: 600,
                                      borderRadius: 6,
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      width: '100%',
                                    }}
                                  >
                                    <Archive size={14} />
                                    <span>Archive Job</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuJobId(null);
                                      setDeleteModalJob(job);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      padding: '8px 10px',
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#dc2626',
                                      fontSize: '0.8125rem',
                                      fontWeight: 600,
                                      borderRadius: 6,
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      width: '100%',
                                    }}
                                  >
                                    <Trash2 size={14} />
                                    <span>Delete Draft</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}

      {/* Create Job Modal */}
      {createModalOpen && (
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
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 20,
              maxWidth: 640,
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)' }}>New Requisition</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 0' }}>Create Job Requisition</h2>
              </div>
              <button onClick={() => setCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateJob} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Job Requisition Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Concurrency Engineer / Senior Structural FEA Engineer"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-medium)', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Career Domain</label>
                  <select
                    value={formData.careerDomain}
                    onChange={e => setFormData({ ...formData, careerDomain: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-medium)', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  >
                    <option value="technology">Technology</option>
                    <option value="engineering_core">Engineering / Core</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="creative">Creative</option>
                    <option value="marketing">Marketing & Sales</option>
                    <option value="hr">HR & Administration</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare / Life Sciences</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Target Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-medium)', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Job Description & Core Scope</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe technical boundaries, problem domain, and required proof outcomes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-medium)', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.875rem', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Required Skills</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="e.g. Concurrency, GD&T, DCF Modeling"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-medium)', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontSize: '0.8125rem' }}
                  />
                  <button type="button" onClick={handleAddSkill} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {formData.requiredSkills?.map((s, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, background: 'var(--accent-primary)14', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{creating ? 'Creating...' : 'Create & Synthesize DNA'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {dnaJob && (
        <JobDNAModal
          job={dnaJob}
          isOpen={!!dnaJob}
          onClose={() => setDnaJob(null)}
          onUpdated={updated => {
            setDnaJob(updated);
            refetch();
          }}
          onOpenAssessmentGen={() => {
            setAssessmentJob(dnaJob);
            setDnaJob(null);
          }}
        />
      )}

      {assessmentJob && (
        <AssessmentGeneratorModal
          job={assessmentJob}
          isOpen={!!assessmentJob}
          onClose={() => setAssessmentJob(null)}
          onPublished={() => {
            refetch();
          }}
        />
      )}

      {deleteModalJob && (
        <SafeDeleteModal
          isOpen={!!deleteModalJob}
          onClose={() => setDeleteModalJob(null)}
          entityType="job"
          entityId={deleteModalJob._id}
          entityTitle={deleteModalJob.title}
          initialStatus={deleteModalJob.status}
          onSuccess={action => {
            if (action === 'DELETED') {
              showToast('success', 'Job Deleted', 'Draft job requisition permanently removed.');
            } else if (action === 'ARCHIVED') {
              showToast('success', 'Job Archived', 'Job requisition archived safely. Candidate evidence preserved.');
            } else {
              showToast('success', 'Job Restored', 'Requisition successfully restored to active state.');
            }
            refetch();
          }}
        />
      )}
    </div>
  );
};
