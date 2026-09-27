import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, ArrowRight, Clock, CheckCircle2,
  Lock, Zap, Star, ChevronDown, X, Filter, Sparkles, RefreshCw, AlertCircle,
  Briefcase, Dna, FileText, Send, Building2
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { CAREER_DOMAINS } from '../../data/careerTaxonomy';
import { useChallenges } from '../../hooks/useChallenges';
import { useJobs } from '../../hooks/useJobs';
import { CandidateAssessmentModal } from '../../components/candidate/CandidateAssessmentModal';
import { applicationService } from '../../services/application.service';
import { useToast } from '../../components/Toast';
import type { Challenge, Job } from '../../types/api';

interface CandidateChallengesProps {
  onEnterWorkspace: (challenge?: any) => void;
}

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const ChallengeCard: React.FC<{
  challenge: Challenge;
  professionName: string;
  domainColor: string;
  onStart: () => void;
}> = ({ challenge, professionName, domainColor, onStart }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        transition: 'all 0.25s ease',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)';
        (e.currentTarget as HTMLElement).style.transform = 'none';
      }}
    >
      {/* Top accent line */}
      {challenge.featured && (
        <div style={{ height: 3, background: `linear-gradient(90deg, ${challenge.diffColor || domainColor}, ${challenge.diffColor || domainColor}88)` }} />
      )}

      <div style={{ padding: '1.5rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.875rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: challenge.diffColor || domainColor,
                background: `${challenge.diffColor || domainColor}12`,
                padding: '3px 9px', borderRadius: 4,
                border: `1px solid ${challenge.diffColor || domainColor}25`
              }}>{challenge.difficulty}</span>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                background: 'var(--bg-subtle)', padding: '3px 9px', borderRadius: 4
              }}>{challenge.profession || professionName}</span>
              {challenge.featured && (
                <span style={{
                  fontSize: '0.6875rem', fontWeight: 700, color: '#d97706',
                  display: 'flex', alignItems: 'center', gap: 3
                }}>
                  <Star size={10} fill="#d97706" /> Featured
                </span>
              )}
            </div>
            <h3 style={{
              fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-main)',
              letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: '0.375rem'
            }}>{challenge.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {challenge.tagline}
            </p>
          </div>
        </div>

        {/* Tools / Skills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {(challenge.tools || []).map(t => (
            <span key={t} style={{
              fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
              padding: '3px 8px', borderRadius: 5, fontFamily: 'var(--font-mono)'
            }}>{t}</span>
          ))}
          {challenge.effort && (
            <span style={{
              fontSize: '0.6875rem', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4
            }}>
              <Clock size={11} /> {challenge.effort}
            </span>
          )}
        </div>

        {/* Proves list */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            What you prove:
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(challenge.proves || []).map(p => (
              <span key={p} style={{
                fontSize: '0.75rem', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 4
              }}>
                <CheckCircle2 size={11} color={domainColor} /> {p}
              </span>
            ))}
          </div>
        </div>

        {/* Expand scenario details */}
        {expanded && (challenge.scenario || challenge.deliverables) && (
          <div style={{
            background: 'var(--bg-subtle)', borderRadius: 8, padding: '1rem',
            marginBottom: '1.25rem', border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem'
          }}>
            {challenge.scenario && (
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: 2 }}>Real-world brief:</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{challenge.scenario}</p>
              </div>
            )}
            {challenge.deliverables && (
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>Required deliverables:</strong>
                <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--text-secondary)' }}>
                  {challenge.deliverables.map(d => <li key={d} style={{ marginBottom: 2 }}>{d}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600
            }}
          >
            {expanded ? 'Hide brief' : 'Inspect brief'}
            <ChevronDown size={13} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          <button
            onClick={onStart}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: domainColor, color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: '0.8125rem',
              fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s ease'
            }}
          >
            Start Mission <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CandidateChallenges: React.FC<CandidateChallengesProps> = ({ onEnterWorkspace }) => {
  const { showToast } = useToast();
  const { selectedDomain, selectedProfession, setDomainById } = useCareer();
  const [activeDomainTab, setActiveDomainTab] = useState<string>(selectedDomain.id);
  const [difficulty, setDifficulty] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedJobAssessment, setSelectedJobAssessment] = useState<Job | null>(null);
  const [activeApplicationId, setActiveApplicationId] = useState<string>('');
  const [loadingAssessment, setLoadingAssessment] = useState<boolean>(false);

  const domainConfig = CAREER_DOMAINS.find(d => d.id === activeDomainTab) || selectedDomain;

  const handleTakeAssessment = async (job: Job) => {
    setLoadingAssessment(true);
    try {
      const myApps = await applicationService.getMyApplications();
      let app = myApps.find(a => (a.jobId as any)?._id === job._id || a.jobId === job._id);
      if (!app) {
        app = await applicationService.applyToJob(job._id);
      }
      setActiveApplicationId(app._id);
      setSelectedJobAssessment(job);
    } catch (err: any) {
      console.warn('Fallback to direct assessment preview:', err.message);
      setActiveApplicationId('');
      setSelectedJobAssessment(job);
    } finally {
      setLoadingAssessment(false);
    }
  };

  // Real backend query through hook
  const { challenges, loading, error, refetch } = useChallenges({
    domain: domainConfig.name,
    difficulty: difficulty !== 'All' ? difficulty : undefined,
    search: search || undefined,
  });

  // Also query recruiter jobs & live assessments
  const { jobs } = useJobs();
  const recruiterLiveJobs = jobs.filter(j => {
    const matchesDomain =
      j.careerDomain?.toLowerCase() === domainConfig.id?.toLowerCase() ||
      j.careerDomain?.toLowerCase() === domainConfig.name?.toLowerCase() ||
      j.careerDomain?.toLowerCase() === domainConfig.name?.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    return matchesDomain;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      {/* ── EDITORIAL HEADER ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: domainConfig.color
          }}>
            {domainConfig.name} Challenge & Requisition Catalog
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)',
          lineHeight: 1.1, marginBottom: '0.625rem'
        }}>
          Find something worth proving.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 620 }}>
          Real work challenges and enterprise recruiter assessments evaluated on actual deliverables — not multiple-choice trivia.
        </p>
      </div>

      {/* ── CAREER DOMAIN FILTER STRIP ── */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {CAREER_DOMAINS.map(d => {
          const isActive = d.id === activeDomainTab;
          return (
            <button
              key={d.id}
              onClick={() => {
                setActiveDomainTab(d.id);
                setDomainById(d.id);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 999,
                border: `1.5px solid ${isActive ? d.color : 'var(--border-subtle)'}`,
                background: isActive ? `${d.color}15` : 'var(--bg-surface)',
                color: isActive ? d.color : 'var(--text-secondary)',
                fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
              <span>{d.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── LIVE RECRUITER ASSESSMENTS HIGHLIGHT ── */}
      {recruiterLiveJobs.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
            <Sparkles size={16} color="#059669" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Live Recruiter Enterprise Assessments ({recruiterLiveJobs.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recruiterLiveJobs.map(job => (
              <div
                key={job._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(5,150,105,0.04), rgba(16,185,129,0.02))',
                  border: '1.5px solid rgba(5,150,105,0.25)',
                  borderRadius: 14,
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.15)', color: '#059669'
                    }}>
                      Live Requisition Assessment
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {job.department} · {job.experience} experience
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                    {job.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 8px', maxWidth: 720, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span><strong>Duration:</strong> {job.assessmentDurationMinutes || 60} mins</span>
                    <span><strong>Difficulty:</strong> {job.difficulty}</span>
                    <span><strong>Competencies:</strong> {job.competencies?.length || 5} Calibrated Dimensions</span>
                  </div>
                </div>

                <button
                  onClick={() => handleTakeAssessment(job)}
                  disabled={loadingAssessment}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 8,
                    background: '#059669', color: '#fff', border: 'none',
                    fontSize: '0.8125rem', fontWeight: 700, cursor: loadingAssessment ? 'wait' : 'pointer', flexShrink: 0
                  }}
                >
                  <Send size={13} />
                  <span>{loadingAssessment ? 'Launching...' : 'Take Assessment'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH & DIFFICULTY BAR ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)'
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${domainConfig.name} challenges, skills, tools...`}
            style={{
              width: '100%', padding: '11px 14px 11px 40px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, fontSize: '0.9375rem', color: 'var(--text-main)',
              outline: 'none', fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-sm)'
            }}
            onFocus={e => (e.target.style.borderColor = domainConfig.color)}
            onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: '8px 14px', borderRadius: 8,
                border: `1px solid ${difficulty === d ? domainConfig.color : 'var(--border-subtle)'}`,
                background: difficulty === d ? `${domainConfig.color}15` : 'var(--bg-surface)',
                color: difficulty === d ? domainConfig.color : 'var(--text-secondary)',
                fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULT COUNT / STATUS ── */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {loading ? 'Querying backend...' : (
            <>
              <strong style={{ color: 'var(--text-main)' }}>{challenges.length}</strong> challenges available in {domainConfig.name}
            </>
          )}
        </span>
        {(difficulty !== 'All' || search) && (
          <button
            onClick={() => { setDifficulty('All'); setSearch(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'underline'
            }}
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* ── ERROR STATE WITH RETRY ── */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Failed to load challenges from backend</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{error}</div>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
              color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Try Again
          </button>
        </div>
      )}

      {/* ── LOADING STATE ── */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 14, padding: '1.5rem', minHeight: 220, display: 'flex',
              flexDirection: 'column', gap: '0.75rem'
            }}>
              <div style={{ width: 120, height: 18, background: 'var(--bg-subtle)', borderRadius: 4 }} />
              <div style={{ width: '80%', height: 24, background: 'var(--bg-subtle)', borderRadius: 4 }} />
              <div style={{ width: '100%', height: 40, background: 'var(--bg-subtle)', borderRadius: 4 }} />
              <div style={{ width: '40%', height: 20, background: 'var(--bg-subtle)', borderRadius: 4, marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── CHALLENGE GRID ── */}
      {!loading && !error && challenges.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1rem' }}>
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge._id || challenge.id}
              challenge={challenge}
              professionName={challenge.profession || selectedProfession.name}
              domainColor={domainConfig.color}
              onStart={() => onEnterWorkspace(challenge)}
            />
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && !error && challenges.length === 0 && recruiterLiveJobs.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg-surface)', borderRadius: 14,
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
            No challenges found for {domainConfig.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 1.25rem' }}>
            There are currently no active missions in this filter. Try clearing your search query or choosing another domain.
          </div>
          {(difficulty !== 'All' || search) && (
            <button
              onClick={() => { setDifficulty('All'); setSearch(''); }}
              style={{
                padding: '8px 18px', background: domainConfig.color, color: '#fff',
                border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Candidate Assessment Modal for Recruiter Jobs */}
      {selectedJobAssessment && (
        <CandidateAssessmentModal
          applicationId={activeApplicationId}
          isOpen={!!selectedJobAssessment}
          onClose={() => {
            setSelectedJobAssessment(null);
            setActiveApplicationId('');
          }}
          previewMode={!activeApplicationId}
          onSubmitted={() => {
            showToast(
              'success',
              'Assessment Submitted! 🚀',
              'Your deliverable and engineering decision records are now queued for reviewer inspection.'
            );
            refetch();
          }}
          previewAssessment={{
            title: `${selectedJobAssessment.title} — Practical Proof Assessment`,
            scenario: `Enterprise production requirements for ${selectedJobAssessment.title}. Prove hands-on mastery in ${selectedJobAssessment.department}.`,
            practicalTask: selectedJobAssessment.description,
            timeLimitMinutes: selectedJobAssessment.assessmentDurationMinutes || 60,
            difficulty: selectedJobAssessment.difficulty || 'Advanced',
            constraints: selectedJobAssessment.jobDNA?.mandatoryRequirements || ['Provide Architectural Decision Record (ADR)', 'Pass all automated tests'],
            deliverables: ['Production code repository / 3D CAD models', 'Engineering Decision Record (EDR/ADR)', 'Hermetic verification tests'],
            rubricCriteria: (selectedJobAssessment.competencies || []).map((c, i) => ({
              id: `comp_${i}`,
              label: c.name,
              weight: c.weight,
              description: c.description || 'Verified competency standard',
            })),
          }}
        />
      )}
    </div>
  );
};

