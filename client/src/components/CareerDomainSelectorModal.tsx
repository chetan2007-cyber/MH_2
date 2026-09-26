import React, { useState } from 'react';
import {
  Code, TrendingUp, Megaphone, Palette, Users,
  GraduationCap, Cpu, Activity, Check, ArrowRight, X, Sparkles
} from 'lucide-react';
import { useCareer } from '../context/CareerContext';
import { CAREER_DOMAINS, PROFESSION_CONFIGS, getProfessionConfig } from '../data/careerTaxonomy';

const DOMAIN_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  Code,
  TrendingUp,
  Megaphone,
  Palette,
  Users,
  GraduationCap,
  Cpu,
  Activity,
};

interface CareerDomainSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerDomainSelectorModal: React.FC<CareerDomainSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedDomain, selectedProfession, setProfession, setDomainById } = useCareer();
  const [activeDomainId, setActiveDomainId] = useState<string>(selectedDomain.id);
  const [selectedProfName, setSelectedProfName] = useState<string>(selectedProfession.name);

  if (!isOpen) return null;

  const currentDomain = CAREER_DOMAINS.find(d => d.id === activeDomainId) || CAREER_DOMAINS[0];

  const handleApply = () => {
    setProfession(selectedProfName);
    onClose();
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
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={13} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>
                Career & Profession Taxonomy
              </span>
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0 }}>
              What kind of work do you want to prove?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
              Kaushal adapts proof metrics, challenge criteria, and review rubrics specifically to your profession.
            </p>
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

        {/* Content: Left Domains | Right Professions */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, overflow: 'hidden' }}>

          {/* Left: Domain Cards List */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: 'var(--bg-app)',
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
              Select Career Domain
            </div>
            {CAREER_DOMAINS.map(d => {
              const Icon = DOMAIN_ICONS[d.iconName] || Code;
              const isSelected = d.id === activeDomainId;

              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDomainId(d.id);
                    // auto select first matching profession in domain
                    const firstProf = d.professions.find(p => PROFESSION_CONFIGS[p]) || d.professions[0];
                    setSelectedProfName(firstProf);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: `1.5px solid ${isSelected ? d.color : 'var(--border-subtle)'}`,
                    background: isSelected ? 'var(--bg-surface)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isSelected ? d.gradient : 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#fff' : d.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{d.name}</span>
                      {isSelected && <Check size={14} color={d.color} style={{ marginTop: 2 }} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                      {d.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Profession Selection & Proof Highlights */}
          <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${currentDomain.color}15`,
                  color: currentDomain.color,
                  border: `1px solid ${currentDomain.color}30`,
                }}>
                  {currentDomain.name}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {currentDomain.professions.length} verified specializations
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                Choose your specific role:
              </h3>
            </div>

            {/* Sub-branch / Specialization Filter if available */}
            {currentDomain.subBranches && currentDomain.subBranches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {currentDomain.subBranches.map(sb => (
                  <div key={sb.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: currentDomain.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentDomain.color }} />
                      {sb.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {sb.professions.map(prof => {
                        const isSelected = selectedProfName === prof;
                        return (
                          <button
                            key={prof}
                            onClick={() => setSelectedProfName(prof)}
                            style={{
                              padding: '9px 12px',
                              borderRadius: 8,
                              border: `1.5px solid ${isSelected ? currentDomain.color : 'var(--border-subtle)'}`,
                              background: isSelected ? `${currentDomain.color}0e` : 'var(--bg-surface)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                            }}
                          >
                            <span style={{ fontSize: '0.8125rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? currentDomain.color : 'var(--text-main)' }}>
                              {prof}
                            </span>
                            {isSelected && <Check size={14} color={currentDomain.color} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Flat Profession Chips */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {currentDomain.professions.map(prof => {
                  const isSelected = selectedProfName === prof;

                  return (
                    <button
                      key={prof}
                      onClick={() => setSelectedProfName(prof)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: `1.5px solid ${isSelected ? currentDomain.color : 'var(--border-subtle)'}`,
                        background: isSelected ? `${currentDomain.color}0c` : 'var(--bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? currentDomain.color : 'var(--text-main)' }}>
                          {prof}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          Full Proof Framework
                        </div>
                      </div>
                      {isSelected && <Check size={16} color={currentDomain.color} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Preview of Proof Types for Selected Profession */}
            {(() => {
              const profConfig = getProfessionConfig(selectedProfName);
              if (!profConfig) return null;
              return (
                <div
                  style={{
                    background: 'var(--bg-subtle)',
                    borderRadius: 14,
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: currentDomain.color, marginBottom: '0.5rem' }}>
                    What You Will Prove as a {selectedProfName}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                    {profConfig.proofTypes.map((pt, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 10px',
                          background: 'var(--bg-surface)',
                          borderRadius: 8,
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem',
                          color: 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <strong style={{ color: 'var(--text-main)', fontSize: '0.8125rem' }}>{pt.label}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{pt.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
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
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--text-main)' }}>{selectedProfName}</strong> ({currentDomain.name})
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
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
              onClick={handleApply}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: currentDomain.color,
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Apply Role Experience <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
