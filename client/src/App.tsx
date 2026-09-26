import React, { useEffect, useState } from 'react';
import { ToastProvider } from './components/Toast';
import { BrandLogo } from './components/BrandLogo';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { ActiveSessionsModal } from './components/ActiveSessionsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PublicProofView } from './components/PublicProofView';
import { LandingView } from './components/LandingView';

// ── Three Bespoke Role-Specific Experiences ──
import { CandidateShell } from './designs/candidate/CandidateShell';
import { ReviewerShell } from './designs/reviewer/ReviewerShell';
import { RecruiterShell } from './designs/recruiter/RecruiterShell';
import { CareerProvider } from './context/CareerContext';

import { api } from './api';
import { Sparkles, Terminal, Shield, Search, Globe, ChevronRight } from 'lucide-react';

type ActiveRoleMode = 'candidate' | 'reviewer' | 'recruiter' | 'landing';

function AppContent() {
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Active Role Experience Selection
  const [roleMode, setRoleMode] = useState<ActiveRoleMode>('candidate');

  // Modals & Utilities
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Public Proof Route (/proof/:token)
  const [publicProofToken, setPublicProofToken] = useState<string | null>(null);

  useEffect(() => {
    // Theme default to SaaS light theme
    document.documentElement.setAttribute('data-theme', 'light');

    // Check pathname for public proof sharing route
    const path = window.location.pathname;
    if (path.startsWith('/proof/')) {
      const token = path.replace('/proof/', '').trim();
      if (token) {
        setPublicProofToken(token);
        return;
      }
    }

    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      const currentUser = res.data?.user || (res as any).user;
      if (res.success && currentUser) {
        setUser(currentUser);
        if (currentUser.role === 'REVIEWER') setRoleMode('reviewer');
        else if (currentUser.role === 'RECRUITER') setRoleMode('recruiter');
        else setRoleMode('candidate');
      } else {
        setUser(null);
        setRoleMode('landing');
      }
    } catch {
      setUser(null);
      setRoleMode('landing');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setRoleMode('landing');
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  // If visiting public proof URL directly
  if (publicProofToken) {
    return (
      <div style={{ display: 'block', minHeight: '100vh', background: 'var(--bg-app)' }}>
        <header
          style={{
            height: 56,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BrandLogo size={24} showWordmark={true} />
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px',
              borderRadius: 999, background: 'rgba(5,150,105,0.1)', color: '#059669',
              border: '1px solid rgba(5,150,105,0.2)'
            }}>
              PUBLIC PROOF PASSPORT™
            </span>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setPublicProofToken(null);
              setRoleMode('candidate');
            }}
            style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600
            }}
          >
            Explore Platform
          </button>
        </header>

        <main style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.5rem' }}>
          <PublicProofView
            token={publicProofToken}
            onNavigateHome={() => {
              window.history.pushState({}, '', '/');
              setPublicProofToken(null);
              setRoleMode('candidate');
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── ROLE-SPECIFIC BESPOKE SHELL ── */}
      {roleMode === 'candidate' && (
        <CandidateShell
          user={user || { name: 'Chetan Sharma', role: 'CANDIDATE' }}
          onLogout={handleLogout}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      )}

      {roleMode === 'reviewer' && (
        <ReviewerShell
          user={{ name: 'Dr. Vikram Malhotra', role: 'REVIEWER' }}
          onLogout={handleLogout}
        />
      )}

      {roleMode === 'recruiter' && (
        <RecruiterShell
          user={{ name: 'Priya Nair', role: 'RECRUITER' }}
          onLogout={handleLogout}
        />
      )}

      {roleMode === 'landing' && (
        <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
          <header style={{
            height: 60, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem'
          }}>
            <BrandLogo size={28} showWordmark={true} />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setRoleMode('candidate')}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600
                }}
              >
                Candidate Workspace
              </button>
              <button
                onClick={() => handleOpenAuth('login')}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none',
                  background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700
                }}
              >
                Sign In
              </button>
            </div>
          </header>
          <LandingView
            onNavigate={(v) => {
              if (v === 'challenges' || v === 'overview') setRoleMode('candidate');
              else if (v === 'reviewer') setRoleMode('reviewer');
              else if (v === 'recruiter') setRoleMode('recruiter');
            }}
            onOpenAuth={handleOpenAuth}
            user={user}
          />
        </div>
      )}

      {/* ── FLOATING MULTI-ROLE EXPERIENCE DOCK ── */}
      <aside
        aria-label="Kaushal Role Experiences"
        style={{
          position: 'fixed',
          bottom: 18,
          right: 20,
          zIndex: 9999,
          background: '#0f172a',
          borderRadius: 14,
          padding: '4px 6px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          backdropFilter: 'blur(12px)',
        }}
      >
        <span style={{
          fontSize: '0.625rem',
          fontWeight: 800,
          color: '#64748b',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0 8px 0 6px',
        }}>
          Role UX:
        </span>

        {/* Candidate Experience Button */}
        <button
          onClick={() => setRoleMode('candidate')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: roleMode === 'candidate' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
            color: roleMode === 'candidate' ? '#fff' : '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Candidate Experience: Build / Create / Prove"
        >
          <Terminal size={13} />
          <span>Candidate</span>
        </button>

        {/* Reviewer Experience Button */}
        <button
          onClick={() => setRoleMode('reviewer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: roleMode === 'reviewer' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
            color: roleMode === 'reviewer' ? '#fff' : '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Reviewer Experience: Inspect / Judge / Verify"
        >
          <Shield size={13} />
          <span>Reviewer</span>
        </button>

        {/* Recruiter Experience Button */}
        <button
          onClick={() => setRoleMode('recruiter')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: roleMode === 'recruiter' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: roleMode === 'recruiter' ? '#fff' : '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Recruiter Experience: Discover / Compare / Connect"
        >
          <Search size={13} />
          <span>Recruiter</span>
        </button>

        {/* Landing Page Button */}
        <button
          onClick={() => setRoleMode('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 8,
            border: 'none',
            background: roleMode === 'landing' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: roleMode === 'landing' ? '#fff' : '#64748b',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Platform Landing & Overview"
        >
          <Globe size={12} />
        </button>
      </aside>

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(view) => {
          if (view === 'reviewer') setRoleMode('reviewer');
          else if (view === 'recruiter') setRoleMode('recruiter');
          else setRoleMode('candidate');
        }}
        userRole={user?.role}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={async () => {
          await refreshUser();
        }}
      />

      {/* Active Sessions Modal */}
      <ActiveSessionsModal
        isOpen={sessionsModalOpen}
        onClose={() => setSessionsModalOpen(false)}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => {
          refreshUser();
          setRoleMode('candidate');
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <CareerProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </CareerProvider>
  );
}

export default App;
