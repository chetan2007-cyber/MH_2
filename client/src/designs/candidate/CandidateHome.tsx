import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ShieldCheck, Cpu, ChevronRight,
  Zap, Clock, CheckCircle2, Circle,
  TrendingUp, GitCommit, FileText, Award, Sparkles, SlidersHorizontal,
  RefreshCw, AlertCircle
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useCapabilities } from '../../hooks/useCapabilities';
import { useChallenges } from '../../hooks/useChallenges';
import { useSubmissions } from '../../hooks/useSubmissions';
import { applicationService } from '../../services/application.service';
import { CandidateAssessmentModal } from '../../components/candidate/CandidateAssessmentModal';
import type { Application } from '../../types/api';

type CandidateView = 'home' | 'challenges' | 'workspace' | 'proofgraph' | 'passport' | 'settings';

interface CandidateHomeProps {
  user: any;
  onNavigate: (v: CandidateView) => void;
  onOpenDomainModal?: () => void;
}


// ── Radial ring component for one capability ──
const CapabilityRing: React.FC<{
  label: string;
  score: number;
  color: string;
  size?: number;
}> = ({ label, score, color, size = 64 }) => {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="var(--border-subtle)" strokeWidth={4} />
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={4}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)',
          fontFamily: 'var(--font-mono)'
        }}>
          {score}
        </div>
      </div>
      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', lineHeight: 1.2, maxWidth: 64 }}>
        {label}
      </span>
    </div>
  );
};

// ── Proof Journey Step ──
const JourneyStep: React.FC<{
  label: string; sublabel: string; done?: boolean; active?: boolean; isLast?: boolean;
}> = ({ label, sublabel, done, active, isLast }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, flex: isLast ? 0 : 1 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--emerald-verified)' : active ? 'var(--accent-primary)' : 'var(--bg-subtle)',
        border: `2px solid ${done ? 'var(--emerald-verified)' : active ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}>
        {done
          ? <CheckCircle2 size={14} color="#fff" />
          : active
            ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
            : <Circle size={10} color="var(--text-muted)" />
        }
      </div>
      <div style={{ marginTop: 6, textAlign: 'center' }}>
        <div style={{
          fontSize: '0.75rem', fontWeight: done || active ? 700 : 500,
          color: done ? 'var(--emerald-verified)' : active ? 'var(--accent-primary)' : 'var(--text-muted)'
        }}>{label}</div>
        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 1 }}>{sublabel}</div>
      </div>
    </div>
    {!isLast && (
      <div style={{
        flex: 1, height: 2, marginTop: 13,
        background: done
          ? 'var(--emerald-verified)'
          : 'var(--border-subtle)',
        transition: 'background 0.4s ease'
      }} />
    )}
  </div>
);

// ── Challenge Mission Card ──
const ChallengeMissionCard: React.FC<{
  title: string; description: string; difficulty: string;
  tools: string[]; progress: number; color?: string;
  onContinue: () => void;
}> = ({ title, description, difficulty, tools, progress, color = '#4f46e5', onContinue }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        borderRadius: 14, padding: '1.25rem',
        minWidth: 280, maxWidth: 320, flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: '0.875rem',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transition: 'all 0.2s ease', cursor: 'pointer',
        position: 'relative', overflow: 'hidden'
      }}
      onClick={onContinue}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.08em', color, background: `${color}15`,
          padding: '2px 7px', borderRadius: 4
        }}>{difficulty}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {progress > 0 ? `${progress}% done` : 'Not started'}
        </span>
      </div>

      <div>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 4 }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
          {description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {(tools || []).slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: '0.625rem', color: 'var(--text-muted)',
            background: 'var(--bg-subtle)', padding: '2px 6px',
            borderRadius: 3, fontFamily: 'var(--font-mono)'
          }}>{t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>
          {progress > 0 ? 'Resume Workspace' : 'Start Mission'}
        </span>
        <ArrowRight size={13} color={color} />
      </div>
    </div>
  );
};

export const CandidateHome: React.FC<CandidateHomeProps> = ({ user, onNavigate, onOpenDomainModal }) => {
  const { selectedDomain, selectedProfession } = useCareer();
  const [mounted, setMounted] = useState(false);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [selectedAppForAssessment, setSelectedAppForAssessment] = useState<Application | null>(null);

  // Live hooks for real backend data
  const { capabilitiesData, loading: capLoading, error: capError, refetch: refetchCap } = useCapabilities(user?._id || user?.id);
  const { challenges, loading: chalLoading, error: chalError, refetch: refetchChal } = useChallenges({
    domain: selectedDomain.name,
    profession: selectedProfession.name,
  });
  const { submissions, loading: subLoading } = useSubmissions();

  const loadMyApplications = async () => {
    try {
      const apps = await applicationService.getMyApplications();
      setMyApplications(apps);
    } catch (err) {
      console.error('Failed to load candidate applications:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadMyApplications();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Engineer';
  const proofScore = capabilitiesData?.proofScore ?? 0;
  const verifiedProjectsCount = capabilitiesData?.verifiedProjectsCount ?? 0;
  const expertReviewsCount = capabilitiesData?.expertReviewsCount ?? 0;
  const defenseRoundsCount = capabilitiesData?.defenseRoundsCount ?? 0;

  const capabilities = capabilitiesData?.capabilities || [];

  // Active assigned assessments for candidate
  const assignedApp = myApplications.find(a =>
    ['ASSESSMENT_PENDING', 'ASSESSMENT_IN_PROGRESS', 'ELIGIBLE'].includes(a.status) &&
    (a.jobId?.publishedAssessmentId || a.assessmentAttempt?.assessmentId)
  );

  // Determine current journey from latest submission
  const activeSubmission = submissions[0];
  const journeySteps = [
    { label: 'Challenge Brief', sublabel: 'Started', done: true },
    { label: 'Deliverables', sublabel: 'In Progress', active: !activeSubmission || activeSubmission.status === 'DRAFT', done: activeSubmission && activeSubmission.status !== 'DRAFT' },
    { label: 'Evidence & Tests', sublabel: 'Validation', active: activeSubmission?.status === 'SUBMITTED', done: activeSubmission?.status === 'IN_REVIEW' || activeSubmission?.status === 'VERIFIED' },
    { label: 'Peer Review', sublabel: 'Standard Rubric', active: activeSubmission?.status === 'IN_REVIEW', done: activeSubmission?.status === 'VERIFIED' || activeSubmission?.status === 'DEFENSE_PASSED' },
    { label: 'Defense Round', sublabel: 'Interrogation', active: activeSubmission?.defenseStatus === 'SCHEDULED', done: activeSubmission?.status === 'DEFENSE_PASSED' },
    { label: 'Verified Proof', sublabel: 'On-Chain Signal', done: activeSubmission?.status === 'DEFENSE_PASSED' },
  ];


  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      {/* ── HERO BANNER ── */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.625rem' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: selectedDomain.color,
                background: `${selectedDomain.color}15`, padding: '3px 8px', borderRadius: 4,
                display: 'inline-flex', alignItems: 'center', gap: 5
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedDomain.color }} />
                {selectedDomain.name} Domain
              </span>

              {onOpenDomainModal && (
                <button
                  onClick={onOpenDomainModal}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                    fontSize: '0.6875rem', cursor: 'pointer', textDecoration: 'underline', padding: 0
                  }}
                >
                  Change profession
                </button>
              )}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-main)',
              lineHeight: 1.1, marginBottom: '0.625rem'
            }}>
              Good morning, {firstName}.
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: 400, lineHeight: 1.5 }}>
              {selectedProfession.tagline}{' '}
              <span style={{ color: selectedDomain.color, fontWeight: 600 }}>Your proof is getting stronger.</span>
            </p>
          </div>

          {/* Right: Quick stats */}
          <div style={{
            display: 'flex', gap: '0.875rem', flexWrap: 'wrap',
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)',
            transition: 'all 0.5s ease 0.1s'
          }}>
            {[
              { label: 'Verified Works', value: String(verifiedProjectsCount), icon: CheckCircle2, color: 'var(--emerald-verified)' },
              { label: 'Peer Reviews', value: String(expertReviewsCount), icon: ShieldCheck, color: selectedDomain.color },
              { label: 'Defense Rounds', value: String(defenseRoundsCount), icon: Award, color: 'var(--amber-warning)' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: '1rem 1.25rem',
                display: 'flex', flexDirection: 'column', gap: 4,
                boxShadow: 'var(--shadow-sm)', minWidth: 105
              }}>
                <stat.icon size={16} color={stat.color} />
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {capLoading ? '-' : stat.value}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASSIGNED ENTERPRISE PROOF ASSESSMENT AVAILABLE ── */}
      {assignedApp && (
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(5,150,105,0.06))',
            border: '1.5px solid rgba(79,70,229,0.25)',
            borderRadius: 18,
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent-primary), #059669)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#059669',
                    background: '#05966918',
                    padding: '3px 9px',
                    borderRadius: 5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                  ASSESSMENT AVAILABLE
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {assignedApp.status === 'ASSESSMENT_IN_PROGRESS' ? 'In Progress' : 'Verified Eligible'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: '0 0 0.35rem' }}>
                {assignedApp.jobId?.title || 'Mechanical Design Engineer'}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} color="var(--accent-primary)" />
                  {assignedApp.jobId?.assessmentDurationMinutes || 60} minutes
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={13} color="var(--emerald-verified)" />
                  {assignedApp.jobId?.difficulty || 'Advanced'}
                </span>
                <span>•</span>
                <span>Organization: <strong>{assignedApp.jobId?.organizationId?.name || 'Verified Enterprise'}</strong></span>
              </div>

              {/* Skills Being Evaluated */}
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Skills being evaluated:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(assignedApp.jobId?.competencies?.map((c: any) => c.name) || assignedApp.jobId?.requiredSkills || ['CAD', 'Design Reasoning', 'Engineering Fundamentals', 'Problem Solving']).map((skill: string) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        padding: '3px 9px',
                        borderRadius: 6,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ alignSelf: 'center' }}>
              <button
                onClick={() => setSelectedAppForAssessment(assignedApp)}
                style={{
                  padding: '12px 26px',
                  borderRadius: 10,
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{assignedApp.status === 'ASSESSMENT_IN_PROGRESS' ? 'RESUME ASSESSMENT' : 'START ASSESSMENT'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── ERROR NOTIFICATION (IF ANY) ── */}
      {capError && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '1rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{capError}</span>
          </div>
          <button
            onClick={() => refetchCap()}
            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
          >
            Retry
          </button>
        </div>
      )}


      {/* ── PROFESSION CAPABILITY CONSTELLATION ── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Your {selectedProfession.name} Capability Profile
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Verified capability scores derived from {selectedProfession.primaryProofMetric.toLowerCase()}, reviews, and defense rounds
            </p>
          </div>
          <button
            onClick={() => onNavigate('proofgraph')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--bg-surface)',
              color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            View {selectedProfession.name} ProofGraph™ <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '2rem',
          display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Central overall score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={60} cy={60} r={52} fill="none" stroke="var(--border-subtle)" strokeWidth={6} />
                <circle cx={60} cy={60} r={52} fill="none"
                  stroke={selectedDomain.color} strokeWidth={6}
                  strokeDasharray={327} strokeDashoffset={mounted && proofScore > 0 ? 327 * (1 - proofScore / 100) : 327}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
              }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {capLoading ? '-' : proofScore}
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROOF SCORE</span>
              </div>
            </div>
            {proofScore > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={12} color="var(--emerald-verified)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>Active Evidence</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 100, background: 'var(--border-subtle)', alignSelf: 'center' }} />

          {/* Individual capability rings */}
          <div style={{
            flex: 1, display: 'flex', gap: '1.75rem',
            flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start'
          }}>
            {capLoading && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading verified capability scores...</div>
            )}
            {!capLoading && capabilities.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No capability evidence evaluated yet. Start your first challenge below to build your proof scores.
              </div>
            )}
            {!capLoading && capabilities.map((cap, i) => (
              <div
                key={cap.label}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'none' : 'translateY(8px)',
                  transition: `all 0.4s ease ${0.1 + i * 0.06}s`
                }}
              >
                <CapabilityRing {...cap} color={cap.color || selectedDomain.color} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFESSION-SPECIFIC CHALLENGES ── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Continue proving yourself
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Active {selectedProfession.name} challenges
            </p>
          </div>
          <button
            onClick={() => onNavigate('challenges')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--bg-surface)',
              color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Explore all {selectedProfession.name} challenges <ArrowRight size={14} />
          </button>
        </div>

        {/* Horizontal scroll of mission cards */}
        {chalLoading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: 280, height: 160, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14 }} />
            ))}
          </div>
        )}

        {!chalLoading && challenges.length === 0 && (
          <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: 14, border: '1px dashed var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              No active challenges loaded for {selectedProfession.name}. Browse the full catalog to start a mission.
            </p>
          </div>
        )}

        {!chalLoading && challenges.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {challenges.map((ch, i) => (
              <div
                key={ch._id || ch.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'none' : 'translateX(16px)',
                  transition: `all 0.4s ease ${0.1 + i * 0.1}s`
                }}
              >
                <ChallengeMissionCard
                  title={ch.title}
                  description={ch.tagline}
                  difficulty={ch.difficulty}
                  tools={ch.tools}
                  progress={ch.progress || 0}
                  color={ch.diffColor || selectedDomain.color}
                  onContinue={() => onNavigate('workspace')}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── PROOF JOURNEY TIMELINE ── */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Your Proof Journey
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Current status: {activeSubmission ? `${activeSubmission.challengeTitle} (${activeSubmission.status})` : 'Select a challenge to begin proving capability'}
        </p>

        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '1.75rem 2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {journeySteps.map((step, i) => (
              <JourneyStep
                key={step.label}
                {...step}
                isLast={i === journeySteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE ASSESSMENT WORKSPACE MODAL ── */}
      {selectedAppForAssessment && (
        <CandidateAssessmentModal
          applicationId={selectedAppForAssessment._id}
          isOpen={Boolean(selectedAppForAssessment)}
          onClose={() => {
            setSelectedAppForAssessment(null);
            loadMyApplications();
            refetchCap();
          }}
          onSubmitted={() => {
            loadMyApplications();
            refetchCap();
          }}
        />
      )}
    </div>
  );
};

