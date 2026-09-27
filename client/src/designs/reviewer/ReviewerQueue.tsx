import React, { useState } from 'react';
import {
  Clock, ChevronRight, Shield, Cpu, CheckCircle2,
  AlertTriangle, ArrowRight, Layers, BarChart2, Filter, Sparkles, RefreshCw, AlertCircle,
  Dna, Search, Briefcase, FileText, Check, Send
} from 'lucide-react';
import { CAREER_DOMAINS } from '../../data/careerTaxonomy';
import { useReviewQueue } from '../../hooks/useReviewQueue';
import { useJobs } from '../../hooks/useJobs';
import { JobDNAInspectorModal } from './JobDNAInspectorModal';
import { SendAssessmentModal } from '../../components/reviewer/SendAssessmentModal';
import type { Job } from '../../types/api';

export interface ReviewSubmissionItem {
  id: string;
  _id?: string;
  title: string;
  candidate: string;
  candidateName?: string;
  profession: string;
  professionName?: string;
  domain: string;
  domainName?: string;
  domainId?: string;
  difficulty?: string;
  diffColor?: string;
  deliverablesSummary?: string;
  submittedAgo?: string;
  waitingHours?: number;
  criteria?: string[];
  tools?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  claimed?: boolean;
}

interface ReviewerQueueProps {
  onSelectSubmission?: (submission: ReviewSubmissionItem) => void;
  onInspect?: (submission: ReviewSubmissionItem) => void;
  initialTab?: 'submissions' | 'job_dna';
}

export const ReviewerQueue: React.FC<ReviewerQueueProps> = ({
  onSelectSubmission,
  onInspect,
  initialTab = 'submissions',
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'job_dna'>(initialTab);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobDNA, setSelectedJobDNA] = useState<Job | null>(null);
  const [selectedJobForSend, setSelectedJobForSend] = useState<Job | null>(null);

  const handleSelect = (sub: ReviewSubmissionItem) => {
    if (onSelectSubmission) onSelectSubmission(sub);
    if (onInspect) onInspect(sub);
  };

  // Real backend hooks
  const {
    queue,
    loading: queueLoading,
    error: queueError,
    refetch: refetchQueue,
  } = useReviewQueue(selectedDomainFilter !== 'All' ? selectedDomainFilter : undefined);

  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useJobs(
    selectedDomainFilter !== 'All'
      ? { careerDomain: selectedDomainFilter.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_') }
      : undefined
  );

  const filteredQueue = queue.filter(sub => {
    const matchesDiff = selectedDifficulty === 'All' || (sub.difficulty || 'Advanced') === selectedDifficulty;
    const matchesSearch = !searchQuery || sub.title?.toLowerCase().includes(searchQuery.toLowerCase()) || sub.profession?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const filteredJobs = jobs.filter(job => {
    const matchesDomain =
      selectedDomainFilter === 'All' ||
      job.careerDomain?.toLowerCase() === selectedDomainFilter.toLowerCase() ||
      job.careerDomain?.toLowerCase() === selectedDomainFilter.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    const matchesDiff = selectedDifficulty === 'All' || (job.difficulty || 'Advanced') === selectedDifficulty;
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesDiff && matchesSearch;
  });

  const activeDomain = CAREER_DOMAINS.find(d => d.name === selectedDomainFilter) || {
    id: 'all',
    name: 'All Domains',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  };

  const currentLoading = activeTab === 'submissions' ? queueLoading : jobsLoading;
  const currentError = activeTab === 'submissions' ? queueError : jobsError;

  const handleRefresh = () => {
    if (activeTab === 'submissions') refetchQueue();
    else refetchJobs();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      {/* ── QUEUE HEADER ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: activeTab === 'submissions' ? activeDomain.color : '#059669',
              }}
            >
              Auditor & Peer Review Workspace
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={currentLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={currentLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--text-main)',
            lineHeight: 1.1,
            marginBottom: '0.375rem',
          }}
        >
          {activeTab === 'submissions'
            ? 'Candidate Deliverables & Verification Queue'
            : 'Recruiter Job DNA & Requisition Benchmarks'}
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          {activeTab === 'submissions'
            ? 'Evaluate anonymous candidate deliverables and proof of work against standardized role rubrics.'
            : 'Inspect Job DNA specifications, competency models, and rubric benchmarks synthesized from recruiter job requisitions.'}
        </p>
      </div>

      {/* ── TOP VIEW TOGGLE: Submissions vs Job DNA ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-surface)',
          padding: 6,
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'submissions' ? '#4f46e5' : 'transparent',
            color: activeTab === 'submissions' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Cpu size={14} />
          <span>Candidate Deliverables</span>
          <span
            style={{
              fontSize: '0.6875rem',
              padding: '1px 6px',
              borderRadius: 99,
              background: activeTab === 'submissions' ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
              color: activeTab === 'submissions' ? '#fff' : 'var(--text-muted)',
            }}
          >
            {queue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('job_dna')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'job_dna' ? '#059669' : 'transparent',
            color: activeTab === 'job_dna' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Dna size={14} />
          <span>Recruiter Job DNA</span>
          <span
            style={{
              fontSize: '0.6875rem',
              padding: '1px 6px',
              borderRadius: 99,
              background: activeTab === 'job_dna' ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
              color: activeTab === 'job_dna' ? '#fff' : 'var(--text-muted)',
            }}
          >
            {jobs.length}
          </span>
        </button>
      </div>

      {/* ── CAREER DOMAIN FILTER TABS ── */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSelectedDomainFilter('All')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 999,
            border: `1.5px solid ${selectedDomainFilter === 'All' ? (activeTab === 'submissions' ? '#4f46e5' : '#059669') : 'var(--border-subtle)'}`,
            background:
              selectedDomainFilter === 'All'
                ? activeTab === 'submissions'
                  ? 'rgba(79,70,229,0.12)'
                  : 'rgba(5,150,105,0.12)'
                : 'var(--bg-surface)',
            color:
              selectedDomainFilter === 'All'
                ? activeTab === 'submissions'
                  ? '#4f46e5'
                  : '#059669'
                : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: selectedDomainFilter === 'All' ? 700 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <span>All Career Domains ({activeTab === 'submissions' ? queue.length : jobs.length})</span>
        </button>

        {CAREER_DOMAINS.map(d => {
          const isSelected = selectedDomainFilter === d.name;
          const count =
            activeTab === 'submissions'
              ? queue.filter(s => s.domain === d.name || s.domainName === d.name).length
              : jobs.filter(
                  j =>
                    j.careerDomain?.toLowerCase() === d.name.toLowerCase() ||
                    j.careerDomain?.toLowerCase() === d.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')
                ).length;

          return (
            <button
              key={d.id}
              onClick={() => setSelectedDomainFilter(d.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 999,
                border: `1.5px solid ${isSelected ? d.color : 'var(--border-subtle)'}`,
                background: isSelected ? `${d.color}15` : 'var(--bg-surface)',
                color: isSelected ? d.color : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
              <span>
                {d.name} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── ERROR NOTIFICATION WITH RETRY ── */}
      {currentError && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12,
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Failed to load {activeTab === 'submissions' ? 'reviewer submissions queue' : 'job requisitions'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentError}</div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* ── QUEUE STATS BAR ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {activeTab === 'submissions'
          ? [
              { label: 'Submissions Pending', value: String(filteredQueue.length), color: activeDomain.color },
              { label: 'Avg Waiting Time', value: filteredQueue.length > 0 ? '3.4h' : '--', color: '#0284c7' },
              { label: 'Auditor Reward Pool', value: filteredQueue.length > 0 ? '320 KSH' : '0 KSH', color: '#059669' },
            ].map(st => (
              <div
                key={st.label}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: st.color,
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1,
                  }}
                >
                  {queueLoading ? '-' : st.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{st.label}</div>
              </div>
            ))
          : [
              { label: 'Recruiter Requisitions', value: String(filteredJobs.length), color: '#059669' },
              {
                label: 'Job DNA Synthesized',
                value: String(filteredJobs.filter(j => !!j.jobDNA).length),
                color: '#4f46e5',
              },
              {
                label: 'Active Open Roles',
                value: String(filteredJobs.filter(j => j.status === 'OPEN').length),
                color: '#0284c7',
              },
            ].map(st => (
              <div
                key={st.label}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: st.color,
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1,
                  }}
                >
                  {jobsLoading ? '-' : st.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{st.label}</div>
              </div>
            ))}
      </div>

      {/* ── CONTENT: CANDIDATE SUBMISSIONS LIST ── */}
      {activeTab === 'submissions' && (
        <>
          {queueLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: 120,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                  }}
                />
              ))}
            </div>
          )}

          {!queueLoading && filteredQueue.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {filteredQueue.map(sub => (
                <div
                  key={sub._id || sub.id}
                  onClick={() => handleSelect(sub)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: 'rgba(79,70,229,0.1)',
                          color: '#4f46e5',
                        }}
                      >
                        {sub.profession || sub.professionName || 'Candidate'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>·</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sub.candidate || sub.candidateName || 'Anonymous Candidate'}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.02em',
                        margin: '0 0 4px',
                      }}
                    >
                      {sub.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {sub.deliverablesSummary || 'Deliverables submitted for rubric evaluation'}
                    </p>
                  </div>

                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 18px',
                      borderRadius: 8,
                      background: 'var(--text-main)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Inspect & Audit <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!queueLoading && filteredQueue.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-surface)',
                borderRadius: 14,
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                Queue Clean in {selectedDomainFilter}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                There are currently no submissions awaiting peer review in this domain. Check back soon or view Recruiter Job DNA.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── CONTENT: RECRUITER JOB DNA LIST ── */}
      {activeTab === 'job_dna' && (
        <>
          {jobsLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: 120,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                  }}
                />
              ))}
            </div>
          )}

          {!jobsLoading && filteredJobs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredJobs.map(job => {
                const hasDNA = !!job.jobDNA;
                const isOpen = job.status === 'OPEN';

                return (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJobDNA(job)}
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 14,
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: isOpen ? '#05966914' : 'var(--bg-subtle)',
                            color: isOpen ? '#059669' : 'var(--text-muted)',
                          }}
                        >
                          {job.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {job.department} · {job.careerDomain}
                        </span>
                        {hasDNA && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: 'rgba(5,150,105,0.1)',
                              color: '#059669',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Check size={12} /> AI Calibrated DNA
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.0625rem',
                          fontWeight: 800,
                          color: 'var(--text-main)',
                          margin: '0 0 6px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {job.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          margin: '0 0 10px',
                          maxWidth: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {job.description}
                      </p>

                      <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>
                          <strong>Experience:</strong> {job.experience}
                        </span>
                        <span>
                          <strong>Difficulty:</strong> {job.difficulty}
                        </span>
                        <span>
                          <strong>Applicants:</strong> {job.applicantCount || 0}
                        </span>
                        <span>
                          <strong>Competencies:</strong> {job.competencies?.length || 0} Dimensions
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedJobForSend(job);
                        }}
                        style={{
                          padding: '9px 16px',
                          borderRadius: 8,
                          border: 'none',
                          background: '#059669',
                          color: '#fff',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                        }}
                      >
                        <Send size={13} />
                        <span>Send to Candidate</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedJobDNA(job);
                        }}
                        style={{
                          padding: '9px 16px',
                          borderRadius: 8,
                          border: '1px solid rgba(5,150,105,0.3)',
                          background: 'rgba(5,150,105,0.1)',
                          color: '#059669',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Dna size={14} />
                        <span>{hasDNA ? 'Inspect Job DNA' : 'View Requisition'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!jobsLoading && filteredJobs.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-surface)',
                borderRadius: 14,
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Dna size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                No Recruiter Job Requisitions in {selectedDomainFilter}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                No job requisitions or Job DNA blueprints have been uploaded for this domain filter yet.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── JOB DNA INSPECTOR MODAL ── */}
      {selectedJobDNA && (
        <JobDNAInspectorModal
          job={selectedJobDNA}
          isOpen={!!selectedJobDNA}
          onClose={() => setSelectedJobDNA(null)}
        />
      )}

      {/* ── SEND ASSESSMENT MODAL ── */}
      {selectedJobForSend && (
        <SendAssessmentModal
          job={selectedJobForSend}
          isOpen={!!selectedJobForSend}
          onClose={() => setSelectedJobForSend(null)}
        />
      )}
    </div>
  );
};

