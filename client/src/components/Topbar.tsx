import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Award,
  Terminal,
  LogOut,
  ChevronDown,
  Sparkles,
  Command,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { api, setMemoryToken } from '../api';
import { useToast } from './Toast';

interface TopbarProps {
  user: any;
  currentView: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onOpenSessions: () => void;
  onNavigate: (view: string) => void;
  onRefreshUser: () => Promise<void>;
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  currentView,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenAuth,
  onOpenSessions,
  onNavigate,
  onRefreshUser,
  onToggleMobileSidebar,
}) => {
  const { showToast } = useToast();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const demoRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoSwitch = async (email: string) => {
    setSwitching(true);
    setDemoMenuOpen(false);
    try {
      const res = await api.login({ email, password: 'ProofWork2026!' });
      const token = res.data?.token || (res as any).token;
      const user = res.data?.user || (res as any).user;
      if (res.success && token) {
        setMemoryToken(token);
        await onRefreshUser();
        showToast('success', 'Authenticated with Verified Credentials', `Active as ${user?.name || 'User'} (${user?.role || 'CANDIDATE'})`);
        if (user?.role === 'CANDIDATE') onNavigate('overview');
        else if (user?.role === 'REVIEWER') onNavigate('reviewer');
        else if (user?.role === 'RECRUITER') onNavigate('recruiter');
        else if (user?.role === 'ADMIN') onNavigate('admin');
      } else {
        showToast('error', 'Authentication Failed', res.error || 'Check server connection.');
      }
    } catch (err: any) {
      showToast('error', 'Authentication Error', err.message);
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setMemoryToken(null);
      await onRefreshUser();
      showToast('info', 'Signed Out', 'Your session has been invalidated.');
      onNavigate('landing');
    } catch (err) {
      setMemoryToken(null);
      await onRefreshUser();
      onNavigate('landing');
    }
  };

  // Human-readable breadcrumbs map
  const viewTitles: Record<string, string> = {
    landing: 'Home',
    overview: 'Engineering Overview',
    challenges: 'Challenge Catalog',
    workspace: 'Active Workspace Studio',
    projects: 'Verified Projects & Evidence',
    evidence: 'Evidence Ledger',
    proofgraph: 'ProofGraph™ Visualizer',
    passport: 'Proof Passport™',
    reviews: 'Peer Reviews & Feedback',
    recruiter: 'Talent Sourcing & Vector Search',
    opportunities: 'Opportunities & Direct Pipeline',
    reviewer: 'Double-Blind Review Queue',
    trust: 'Trust Center & Provenance',
    admin: 'Platform Integrity & Moderation',
    settings: 'Settings & Security',
  };

  const currentTitle = viewTitles[currentView] || 'Overview';

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <button
          className="btn btn-ghost btn-icon-sm"
          onClick={onToggleMobileSidebar}
          style={{ display: 'none' }}
          id="mobile-sidebar-toggle"
          aria-label="Toggle Navigation"
        >
          <Menu size={16} />
        </button>

        {/* Brand in Topbar for small screens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Kaushal</span>
            <span>/</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentTitle}</span>
          </span>
        </div>
      </div>

      {/* Middle: Global Search shortcut */}
      <div style={{ flex: '0 1 360px', margin: '0 1rem' }}>
        <button
          onClick={onOpenCommandPalette}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.4rem 0.75rem',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={14} />
            <span>Search challenges, capabilities, candidates...</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-surface)',
              padding: '0.1rem 0.35rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Command size={10} />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions, Theme, Role Switcher, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {/* Dark/Light Theme Toggle */}
        <button
          className="btn btn-ghost btn-icon-sm"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={15} color="var(--amber-warning)" /> : <Moon size={15} color="var(--text-secondary)" />}
        </button>

        {/* Notifications Center Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={15} />
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--cyan-primary)',
              }}
            />
          </button>

          {notifMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '320px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 250,
              }}
            >
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Engineering Activity</span>
                <span className="badge badge-cyan">3 New</span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid var(--border-dim)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    <CheckCircle2 size={13} color="var(--emerald-verified)" />
                    <span>Automated Verification Passed</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Ticket Booking API container suite passed with 2.3ms P99 latency.
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Today · 10:14 AM</div>
                </div>

                <div style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid var(--border-dim)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Briefcase size={13} color="#f59e0b" />
                    <span>Inbound Opportunity from Stripe</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Rachel Vance matched your Redis Locking ADR for Core Ledger.
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Yesterday · 4:30 PM</div>
                </div>

                <div style={{ padding: '0.625rem 0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    <ShieldCheck size={13} color="var(--cyan-primary)" />
                    <span>Peer Review Completed</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Dr. Vikram Malhotra rated Concurrency Architecture 9/10.
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>2 days ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Demo Switcher (Logs into real MongoDB accounts) */}
        <div style={{ position: 'relative' }} ref={demoRef}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            disabled={switching}
            style={{
              borderColor: 'rgba(79, 70, 229, 0.35)',
              background: 'rgba(79, 70, 229, 0.06)',
              color: 'var(--accent-primary)',
            }}
          >
            <Sparkles size={13} />
            <span>{switching ? 'Authenticating...' : 'Demo Role Switcher'}</span>
            <ChevronDown size={13} />
          </button>

          {demoMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '270px',
                padding: '0.5rem',
                zIndex: 250,
              }}
            >
              <div
                style={{
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.35rem',
                }}
              >
                Server-Side Authentication Switcher
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                onClick={() => handleDemoSwitch('arjun.candidate@proofline.dev')}
              >
                <Award size={14} color="var(--accent-primary)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Candidate (Rahul Sharma)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Score 87 · 14 ADRs · 2.3ms P99</div>
                </div>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                onClick={() => handleDemoSwitch('vikram.reviewer@proofline.dev')}
              >
                <Terminal size={14} color="#10b981" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Reviewer (Dr. Vikram)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Calibrated Expert (RRI 1.45)</div>
                </div>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                onClick={() => handleDemoSwitch('rachel@stripe.com')}
              >
                <Search size={14} color="#f59e0b" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Recruiter (Rachel @ Stripe)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Capability Vector Sourcer</div>
                </div>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                onClick={() => handleDemoSwitch('admin@proofline.dev')}
              >
                <ShieldCheck size={14} color="#a855f7" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Admin (Integrity Desk)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Compliance & Audit Logs</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Status / Account Dropdown */}
        {user ? (
          <div style={{ position: 'relative' }} ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.2rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {user.name.charAt(0)}
              </div>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '220px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 250,
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span className="badge badge-cyan">{user.role}</span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigate('settings');
                  }}
                >
                  Account Settings
                </button>

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenSessions();
                  }}
                >
                  Active Sessions
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.35rem 0' }} />

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--rose-error)' }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onOpenAuth('login')}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('register')}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
