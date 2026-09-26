import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Code2,
  TrendingUp,
  Megaphone,
  Palette,
  Users,
  GraduationCap,
  Wrench,
  Activity,
  Shield,
  Search,
  Terminal,
} from 'lucide-react';
import { useToast } from './Toast';
import { useCareer } from '../context/CareerContext';
import { CAREER_DOMAINS, ALL_PROFESSIONS } from '../data/careerTaxonomy';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (role: 'candidate' | 'reviewer' | 'recruiter') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { showToast } = useToast();
  const { setProfession, setDomainById, selectedDomain, selectedProfession } = useCareer();

  const [step, setStep] = useState(1);
  const [platformRole, setPlatformRole] = useState<'candidate' | 'reviewer' | 'recruiter'>('candidate');
  const [chosenDomainId, setChosenDomainId] = useState<string>('tech');
  const [chosenProfessionId, setChosenProfessionId] = useState<string>('software-developer');
  const [selectedSecondarySkills, setSelectedSecondarySkills] = useState<string[]>([]);
  const [userName, setUserName] = useState('Rahul Sharma');

  if (!isOpen) return null;

  const activeDomainObj = CAREER_DOMAINS.find(d => d.id === chosenDomainId) || CAREER_DOMAINS[0];
  const activeProfConfig = ALL_PROFESSIONS[chosenProfessionId] || ALL_PROFESSIONS['software-developer'];

  const handleDomainSelect = (dId: string) => {
    setChosenDomainId(dId);
    const domain = CAREER_DOMAINS.find(d => d.id === dId);
    if (domain && domain.professions.length > 0) {
      const firstProfKey = domain.professions[0].toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
      // check if key in ALL_PROFESSIONS
      const matchKey = Object.keys(ALL_PROFESSIONS).find(k => k.includes(firstProfKey.split('-')[0])) || Object.keys(ALL_PROFESSIONS)[0];
      setChosenProfessionId(matchKey);
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSecondarySkills.includes(skill)) {
      setSelectedSecondarySkills(selectedSecondarySkills.filter(s => s !== skill));
    } else {
      setSelectedSecondarySkills([...selectedSecondarySkills, skill]);
    }
  };

  const handleFinish = () => {
    if (platformRole === 'candidate') {
      setDomainById(chosenDomainId);
      if (activeProfConfig?.name) {
        setProfession(activeProfConfig.name);
      }
      showToast('success', 'Profile Initialized', `Joined Kaushal as ${activeProfConfig?.name || 'Professional'}.`);
    } else if (platformRole === 'reviewer') {
      showToast('success', 'Reviewer Registered', 'You now have access to peer evaluation rubrics across domains.');
    } else {
      showToast('success', 'Recruiter Intelligence', 'Recruiter workspace ready to search verified capability.');
    }
    onComplete(platformRole);
    onClose();
  };

  const getDomainIcon = (iconName: string = 'Sparkles', size = 20) => {
    switch (iconName) {
      case 'Code2': return <Code2 size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Megaphone': return <Megaphone size={size} />;
      case 'Palette': return <Palette size={size} />;
      case 'Users': return <Users size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'Activity': return <Activity size={size} />;
      default: return <Sparkles size={size} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '92vw', padding: '2rem', borderRadius: 18 }}
      >
        {/* Step Indicator */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>
              STEP {step} OF {platformRole === 'candidate' ? 4 : 2}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Kaushal Multidisciplinary Onboarding
            </span>
          </div>

          <div
            style={{
              height: '4px',
              background: 'var(--bg-app)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(step / (platformRole === 'candidate' ? 4 : 2)) * 100}%`,
                background: 'var(--accent-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* ── STEP 1: PLATFORM ROLE SELECTION ── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: 6 }}>
                I want to join Kaushal as...
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Your platform role determines what you can do on the proof network.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                {
                  role: 'candidate' as const,
                  title: 'Candidate',
                  desc: 'Prove your craft through real work, case studies & defense.',
                  icon: Terminal,
                  badge: 'Prove Capability',
                  color: '#4f46e5',
                },
                {
                  role: 'reviewer' as const,
                  title: 'Reviewer',
                  desc: 'Evaluate peer submissions with domain-specific rubrics.',
                  icon: Shield,
                  badge: 'Audit & Verify',
                  color: '#059669',
                },
                {
                  role: 'recruiter' as const,
                  title: 'Recruiter',
                  desc: 'Search verified talent by evidence, models, and craft.',
                  icon: Search,
                  badge: 'Discover Talent',
                  color: '#0284c7',
                },
              ].map((item) => {
                const isSelected = platformRole === item.role;
                const IconComp = item.icon;
                return (
                  <div
                    key={item.role}
                    onClick={() => setPlatformRole(item.role)}
                    style={{
                      padding: '1.25rem 1rem',
                      borderRadius: 14,
                      border: `2px solid ${isSelected ? item.color : 'var(--border-subtle)'}`,
                      background: isSelected ? `${item.color}0c` : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${item.color}15`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: '0.75rem', flex: 1 }}>
                      {item.desc}
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: isSelected ? item.color : 'var(--bg-subtle)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 2 (CANDIDATE): CAREER DOMAIN SELECTION ── */}
        {step === 2 && platformRole === 'candidate' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: 4 }}>
                What kind of work do you want to prove?
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Kaushal adapts challenge missions, proof types & capability models to your profession.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto', paddingRight: 4, marginBottom: '1.5rem' }}>
              {CAREER_DOMAINS.map((dom) => {
                const isSelected = chosenDomainId === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => handleDomainSelect(dom.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? dom.color : 'var(--border-subtle)'}`,
                      background: isSelected ? `${dom.color}0e` : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: `${dom.color}18`,
                        color: dom.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getDomainIcon(dom.iconName || 'Sparkles', 18)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {dom.name}
                        </h4>
                        {isSelected && <Check size={14} color={dom.color} />}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 6px', lineHeight: 1.25 }}>
                        "{dom.description}"
                      </p>
                      <div style={{ fontSize: '0.6875rem', color: dom.color, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dom.professions.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
              >
                Choose Profession <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 (CANDIDATE): SPECIFIC ROLE & SKILLS ── */}
        {step === 3 && platformRole === 'candidate' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: activeDomainObj.color }}>
                {activeDomainObj.name} Domain
              </span>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '3px 0 4px' }}>
                What's your primary role?
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Select your specialized profession to configure your proof passport.
              </p>
            </div>

            {/* Profession list for chosen domain */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
              {activeDomainObj.professions.map((pName) => {
                const key = pName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
                const isSelected = chosenProfessionId === key || (ALL_PROFESSIONS[chosenProfessionId]?.name === pName);
                return (
                  <div
                    key={pName}
                    onClick={() => {
                      const foundKey = Object.keys(ALL_PROFESSIONS).find(k => ALL_PROFESSIONS[k].name === pName) || key;
                      setChosenProfessionId(foundKey);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${isSelected ? activeDomainObj.color : 'var(--border-subtle)'}`,
                      background: isSelected ? `${activeDomainObj.color}12` : 'var(--bg-surface)',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? activeDomainObj.color : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{pName}</span>
                    {isSelected && <Check size={14} color={activeDomainObj.color} />}
                  </div>
                );
              })}
            </div>

            {/* Secondary skill tags */}
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Select secondary skills & core competencies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {((activeProfConfig?.capabilities || []).map((c: any) => c.label) || ['Core Skill 1', 'Core Skill 2', 'Analysis', 'Strategy', 'Execution']).map((s: string) => {
                  const active = selectedSecondarySkills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => handleToggleSkill(s)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        border: `1px solid ${active ? activeDomainObj.color : 'var(--border-subtle)'}`,
                        background: active ? activeDomainObj.color : 'var(--bg-surface)',
                        color: active ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
              >
                Preview Proof Model <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 (CANDIDATE): PROOF MODEL PREVIEW & FINISH ── */}
        {step === 4 && platformRole === 'candidate' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${activeDomainObj.color}15`, color: activeDomainObj.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <CheckCircle2 size={24} />
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '2px 0 4px' }}>
                {activeProfConfig?.name || 'Your Profession'} Proof Infrastructure Ready
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Here is how your craft will be verified on Kaushal:
              </p>
            </div>

            {/* Configured Proof Types */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: activeDomainObj.color, marginBottom: '0.75rem' }}>
                Configured Evidence Types for {activeProfConfig?.name}:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: '1rem' }}>
                {(activeProfConfig?.proofTypes || []).map((pt: any) => (
                  <div key={pt.type || pt.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeDomainObj.color }} />
                    {pt.label || pt.type}
                  </div>
                ))}
              </div>

              {/* Starter Challenge Preview */}
              {activeProfConfig?.challenges && activeProfConfig.challenges.length > 0 && (
                <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
                    Featured Proof Mission
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    "{activeProfConfig.challenges[0].title}"
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={handleFinish}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, background: `linear-gradient(135deg, ${activeDomainObj.color}, #1e293b)` }}
              >
                Launch {activeProfConfig?.name} Workspace <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 (REVIEWER / RECRUITER FINISH) ── */}
        {step === 2 && platformRole !== 'candidate' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: platformRole === 'reviewer' ? 'rgba(5,150,105,0.12)' : 'rgba(2,132,199,0.12)', color: platformRole === 'reviewer' ? '#059669' : '#0284c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                {platformRole === 'reviewer' ? <Shield size={26} /> : <Search size={26} />}
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '2px 0 4px' }}>
                {platformRole === 'reviewer' ? 'Auditor & Reviewer Workspace' : 'Recruiter Discovery Workspace'}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto' }}>
                {platformRole === 'reviewer'
                  ? 'Access submissions across Technology, Finance, Creative, Marketing, Education, HR, Engineering & Healthcare with profession-specific evaluation rubrics.'
                  : 'Search and compare candidate proof portfolios across all 8 career domains, inspecting authentic artifacts, models, audio stems, calculations, and defense rounds.'}
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Supported Evaluation Domains
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CAREER_DOMAINS.map(d => (
                  <span key={d.id} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 6, background: `${d.color}15`, color: d.color, fontWeight: 700 }}>
                    {d.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={handleFinish}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800 }}
              >
                Enter {platformRole === 'reviewer' ? 'Reviewer' : 'Recruiter'} Experience <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
