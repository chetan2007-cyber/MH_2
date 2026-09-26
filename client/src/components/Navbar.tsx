import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Search,
  Briefcase,
  Terminal,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  KeyRound,
  Compass,
} from 'lucide-react';
import { api, setMemoryToken } from '../api';

interface NavbarProps {
  user: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onOpenSessions: () => void;
  onRefreshUser: () => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSessions,
  onRefreshUser,
}) => {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

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
        // Redirect according to role
        if (user?.role === 'CANDIDATE') onNavigate('passport');
        else if (user?.role === 'REVIEWER') onNavigate('reviewer');
        else if (user?.role === 'RECRUITER') onNavigate('recruiter');
        else if (user?.role === 'ADMIN') onNavigate('admin');
      } else {
        alert(res.error || 'Failed to switch demo account.');
      }
    } catch (err: any) {
      alert(err.message || 'Error switching account.');
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setMemoryToken(null);
    await onRefreshUser();
    onNavigate('landing');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div
            onClick={() => onNavigate('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              }}
            >
              <Cpu size={20} color="#041018" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>
                  PROOFLINE
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem' }}>
                  TRACE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links based on role */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.role === 'CANDIDATE' && (
                <>
                  <button
                    className={`btn btn-sm ${currentView === 'passport' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('passport')}
                  >
                    <Award size={15} /> Proof Passport™
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'proofgraph' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('proofgraph')}
                  >
                    <Layers size={15} /> ProofGraph™
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('challenges')}
                  >
                    <Compass size={15} /> Challenges
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('opportunities')}
                  >
                    <Briefcase size={15} /> Opportunities
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'trust' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('trust')}
                  >
                    <ShieldCheck size={15} /> Trust Center
                  </button>
                </>
              )}

              {user.role === 'REVIEWER' && (
                <>
                  <button
                    className={`btn btn-sm ${currentView === 'reviewer' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('reviewer')}
                  >
                    <Terminal size={15} /> Review Queue
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'trust' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('trust')}
                  >
                    <ShieldCheck size={15} /> Calibration & RRI
                  </button>
                </>
              )}

              {user.role === 'RECRUITER' && (
                <>
                  <button
                    className={`btn btn-sm ${currentView === 'recruiter' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('recruiter')}
                  >
                    <Search size={15} /> Talent Discovery
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('opportunities')}
                  >
                    <Briefcase size={15} /> Sent Outreach
                  </button>
                </>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <button
                    className={`btn btn-sm ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('admin')}
                  >
                    <ShieldCheck size={15} /> Admin Control
                  </button>
                  <button
                    className={`btn btn-sm ${currentView === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('challenges')}
                  >
                    <Compass size={15} /> Catalog
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className={`btn btn-sm ${currentView === 'landing' ? 'btn-outline-cyan' : 'btn-secondary'}`}
                onClick={() => onNavigate('landing')}
              >
                Overview
              </button>
              <button
                className={`btn btn-sm ${currentView === 'challenges' ? 'btn-outline-cyan' : 'btn-secondary'}`}
                onClick={() => onNavigate('challenges')}
              >
                Explore Challenges
              </button>
              <button
                className={`btn btn-sm ${currentView === 'recruiter' ? 'btn-outline-cyan' : 'btn-secondary'}`}
                onClick={() => onNavigate('recruiter')}
              >
                Evidence Feed
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Demo Role Switcher & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Demo Switcher Dropdown (Logs in via real API) */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              disabled={switching}
              style={{
                borderColor: 'rgba(6, 182, 212, 0.4)',
                background: 'rgba(6, 182, 212, 0.08)',
                color: 'var(--cyan-primary)',
              }}
            >
              <Sparkles size={14} />
              <span>{switching ? 'Authenticating...' : 'Demo Role Switcher'}</span>
              <ChevronDown size={14} />
            </button>

            {demoMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '260px',
                  padding: '0.5rem',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Authenticates with Real Credentials
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                  onClick={() => handleDemoSwitch('arjun.candidate@proofline.dev')}
                >
                  <Award size={14} color="#06b6d4" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Candidate (Arjun)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Verified Systems Engineer</div>
                  </div>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                  onClick={() => handleDemoSwitch('vikram.reviewer@proofline.dev')}
                >
                  <Terminal size={14} color="#10b981" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reviewer (Dr. Vikram)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Calibrated Expert (RRI: 1.45)</div>
                  </div>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                  onClick={() => handleDemoSwitch('rachel@stripe.com')}
                >
                  <Search size={14} color="#f59e0b" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Recruiter (Rachel @ Stripe)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Capability Vector Sourcer</div>
                  </div>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', margin: '0.2rem 0' }}
                  onClick={() => handleDemoSwitch('admin@proofline.dev')}
                >
                  <ShieldCheck size={14} color="#a855f7" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Admin (Integrity)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Audit Logs & Moderation</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Status / Login Buttons */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--border-bright)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <span
                  className={`badge ${
                    user.role === 'CANDIDATE'
                      ? 'badge-cyan'
                      : user.role === 'REVIEWER'
                      ? 'badge-emerald'
                      : user.role === 'RECRUITER'
                      ? 'badge-amber'
                      : 'badge-purple'
                  }`}
                  style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}
                >
                  {user.role}
                </span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    width: '230px',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenSessions();
                    }}
                  >
                    <KeyRound size={14} /> Active Sessions & Security
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--rose-danger)' }}
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('register')}>
                Prove Your Work
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
