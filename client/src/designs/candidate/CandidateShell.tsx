import React, { useState } from 'react';
import {
  Compass, Cpu, FolderGit2, Network, Award, Settings,
  ChevronLeft, ChevronRight, Bell, User, LogOut,
  Sparkles, Command, Menu, X, SlidersHorizontal
} from 'lucide-react';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { CandidateHome } from './CandidateHome';
import { CandidateChallenges } from './CandidateChallenges';
import { CandidateWorkspaceView } from './CandidateWorkspaceView';
import { CandidateProofGraph } from './CandidateProofGraph';
import { CandidatePassport } from './CandidatePassport';
import { CareerDomainSelectorModal } from '../../components/CareerDomainSelectorModal';
import { useCareer } from '../../context/CareerContext';

type CandidateView = 'home' | 'challenges' | 'workspace' | 'proofgraph' | 'passport' | 'settings';

interface CandidateShellProps {
  user: any;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  onSwitchRole?: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Compass, shortLabel: 'Home' },
  { id: 'challenges', label: 'Challenges', icon: Cpu, shortLabel: 'Build' },
  { id: 'workspace', label: 'Workspace', icon: FolderGit2, shortLabel: 'Work' },
  { id: 'proofgraph', label: 'ProofGraph™', icon: Network, shortLabel: 'Graph' },
  { id: 'passport', label: 'Passport', icon: Award, shortLabel: 'ID' },
];

export const CandidateShell: React.FC<CandidateShellProps> = ({
  user, onLogout, onOpenCommandPalette, onSwitchRole
}) => {
  const { selectedProfession, selectedDomain } = useCareer();
  const [view, setView] = useState<CandidateView>('home');
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [activeSubmissionId] = useState('6ab776c6ef1c989d749010c2');

  const inWorkspace = view === 'workspace';

  const navigateTo = (v: CandidateView) => {
    setView(v);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-app)' }}>

      {/* ── LEFT RAIL (IDE-style, collapses in workspace) ── */}
      {inWorkspace && (
        <aside
          style={{
            width: railCollapsed ? 56 : 220,
            background: '#0f172a',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.22s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 20,
            flexShrink: 0,
          }}
        >
          {/* Rail brand */}
          <div style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: railCollapsed ? 'center' : 'space-between',
            padding: railCollapsed ? '0' : '0 14px 0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {!railCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: selectedDomain.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sparkles size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  kaushal
                </span>
              </div>
            )}
            <button
              onClick={() => setRailCollapsed(!railCollapsed)}
              style={{
                background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 5,
                width: 26, height: 26, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
              }}
            >
              {railCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
            </button>
          </div>

          {/* Rail nav items */}
          <nav style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(item => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as CandidateView)}
                  title={railCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, padding: railCollapsed ? '8px 0' : '7px 10px',
                    justifyContent: railCollapsed ? 'center' : 'flex-start',
                    borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(79,70,229,0.2)' : 'transparent',
                    color: isActive ? '#a5b4fc' : '#64748b',
                    width: '100%',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#64748b';
                    }
                  }}
                >
                  <item.icon size={16} style={{ flexShrink: 0 }} />
                  {!railCollapsed && (
                    <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </span>
                  )}
                  {isActive && !railCollapsed && (
                    <div style={{
                      marginLeft: 'auto', width: 5, height: 5,
                      borderRadius: '50%', background: '#818cf8'
                    }}/>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Rail footer */}
          <div style={{
            padding: '8px 6px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', gap: 2
          }}>
            <button
              onClick={onLogout}
              title="Sign out"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: railCollapsed ? '8px 0' : '7px 10px',
                justifyContent: railCollapsed ? 'center' : 'flex-start',
                borderRadius: 6, border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#64748b', width: '100%',
              }}
            >
              <LogOut size={15} />
              {!railCollapsed && <span style={{ fontSize: '0.8125rem' }}>Sign out</span>}
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* ── TOP NAV (non-workspace mode) ── */}
        {!inWorkspace && (
          <header style={{
            height: 60,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky', top: 0, zIndex: 50,
            flexShrink: 0,
          }}>
            {/* Left: Brand + Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigateTo('home')}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: selectedDomain.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sparkles size={14} color="#fff" />
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '1.0625rem', color: 'var(--text-main)', letterSpacing: '-0.03em'
                }}>kaushal</span>
              </div>

              {/* Career Profession Switcher Pill */}
              <button
                onClick={() => setDomainModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', borderRadius: 999,
                  background: `${selectedDomain.color}15`,
                  border: `1px solid ${selectedDomain.color}35`,
                  color: selectedDomain.color,
                  fontSize: '0.75rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
                title="Change career domain or profession"
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedDomain.color }} />
                <span>{selectedProfession.name}</span>
                <SlidersHorizontal size={11} />
              </button>

              {/* Desktop nav links */}
              <nav style={{ display: 'flex', gap: 4 }} className="hide-mobile">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id as CandidateView)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, border: 'none',
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                      background: view === item.id ? 'var(--accent-subtle)' : 'transparent',
                      color: view === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => {
                      if (view !== item.id) {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-main)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (view !== item.id) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Cmd+K hint */}
              <button
                onClick={onOpenCommandPalette}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                  border: '1px solid var(--border-subtle)', borderRadius: 7, cursor: 'pointer',
                  background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)'
                }}
                className="hide-mobile"
              >
                <Command size={12} /> K
              </button>

              <button style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 6, borderRadius: 8, color: 'var(--text-muted)',
                position: 'relative'
              }}>
                <Bell size={18} />
                <div style={{
                  position: 'absolute', top: 5, right: 5, width: 7, height: 7,
                  background: selectedDomain.color, borderRadius: '50%',
                  border: '1.5px solid white'
                }}/>
              </button>

              {/* Avatar / user menu */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 8px', borderRadius: 8, cursor: 'pointer',
                border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: selectedDomain.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700, color: '#fff'
                }}>
                  {(user?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="hide-mobile">
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {user?.name?.split(' ')[0] || 'Chetan'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1 }}>Candidate</div>
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'none' }}
                className="show-mobile"
              >
                {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
              </button>
            </div>
          </header>
        )}

        {/* ── WORKSPACE TOP BAR ── */}
        {inWorkspace && (
          <div style={{
            height: 48, background: '#0f172a',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                workspace / {selectedProfession.id} /
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                {selectedProfession.challenges[0]?.title || 'active-proof-mission'}
              </span>
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, padding: '2px 8px',
                background: 'rgba(5,150,105,0.2)', color: '#6ee7b7', borderRadius: 4,
                border: '1px solid rgba(5,150,105,0.3)'
              }}>● IN PROGRESS</span>
            </div>
            <button
              onClick={() => navigateTo('home')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem',
                color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer'
              }}
            >
              <X size={14}/> Exit workspace
            </button>
          </div>
        )}

        {/* ── PAGE CONTENT ── */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {view === 'home' && (
            <CandidateHome
              user={user}
              onNavigate={navigateTo}
              onOpenDomainModal={() => setDomainModalOpen(true)}
            />
          )}
          {view === 'challenges' && (
            <CandidateChallenges onEnterWorkspace={() => navigateTo('workspace')} />
          )}
          {view === 'workspace' && (
            <CandidateWorkspaceView submissionId={activeSubmissionId} onExit={() => navigateTo('home')} />
          )}
          {view === 'proofgraph' && (
            <CandidateProofGraph />
          )}
          {view === 'passport' && (
            <CandidatePassport
              user={user}
              onOpenDomainModal={() => setDomainModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Career Domain & Profession Switcher Modal */}
      <CareerDomainSelectorModal
        isOpen={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};
