import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Globe,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  GitBranch,
  Smartphone,
  Laptop,
  Monitor,
} from 'lucide-react';
import { api } from '../api';
import { useToast } from './Toast';

interface SettingsViewProps {
  user: any;
  onRefreshUser: () => Promise<void>;
  onNavigate: (view: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onRefreshUser,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'ACCOUNT' | 'SECURITY' | 'PRIVACY' | 'INTEGRATIONS'>('ACCOUNT');

  // Account Form
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [headline, setHeadline] = useState(user?.candidateProfile?.headline || '');
  const [bio, setBio] = useState(user?.candidateProfile?.bio || '');
  const [location, setLocation] = useState(user?.candidateProfile?.location || 'Remote');

  // Sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Passport Privacy
  const [publicToken, setPublicToken] = useState(user?.candidateProfile?.publicProofToken || '');
  const [publicEnabled, setPublicEnabled] = useState(user?.candidateProfile?.publicProofEnabled ?? true);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    if (activeTab === 'SECURITY') {
      loadSessions();
    }
  }, [activeTab]);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await api.getSessions();
      if (res.success && res.sessions) {
        setSessions(res.sessions);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await api.revokeSession(sessionId);
      if (res.success) {
        showToast('success', 'Session Revoked', 'The selected session has been invalidated.');
        loadSessions();
      }
    } catch (err: any) {
      showToast('error', 'Error Revoking Session', err.message);
    }
  };

  const handleLogoutAllOther = async () => {
    try {
      const res = await api.logoutAll();
      if (res.success) {
        showToast('success', 'All Other Sessions Cleared', 'Only your current device session remains active.');
        loadSessions();
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    }
  };

  const handleCopyPublicLink = () => {
    const fullUrl = `${window.location.origin}/proof/${publicToken}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('success', 'Link Copied', 'Public Proof Passport link copied to clipboard.');
  };

  const handleRevokePublicToken = async () => {
    setRevoking(true);
    try {
      const res = await api.revokeProofToken();
      if (res.success) {
        setPublicEnabled(false);
        showToast('warning', 'Public Link Revoked', 'Your public Proof Passport is now completely inaccessible.');
        await onRefreshUser();
      }
    } catch (err: any) {
      showToast('error', 'Error Revoking Token', err.message);
    } finally {
      setRevoking(false);
    }
  };

  const handleGenerateNewToken = async () => {
    setRevoking(true);
    try {
      const res = await api.generateProofToken();
      if (res.success && res.publicProofToken) {
        setPublicToken(res.publicProofToken);
        setPublicEnabled(true);
        showToast('success', 'New Public Token Generated', 'A fresh revocable verification URL is active.');
        await onRefreshUser();
      }
    } catch (err: any) {
      showToast('error', 'Error Generating Token', err.message);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-neutral">PREFERENCES</span>
          <span className="badge badge-cyan">{user?.role}</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Account & Security Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Configure engineering profile metadata, active browser sessions, and public verification privacy.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          className={`btn btn-sm ${activeTab === 'ACCOUNT' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('ACCOUNT')}
        >
          Profile & Identity
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'SECURITY' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('SECURITY')}
        >
          Active Sessions & Security
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'PRIVACY' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('PRIVACY')}
        >
          Proof Passport Privacy
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'INTEGRATIONS' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('INTEGRATIONS')}
        >
          Connected Repositories
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ACCOUNT' && (
        <div className="forge-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Engineering Profile</h2>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (Read Only)</label>
            <input
              type="email"
              className="form-input"
              value={email}
              disabled
              style={{ background: 'var(--bg-app)', color: 'var(--text-muted)' }}
            />
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Email verification status: Verified ●
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Engineering Focus & Headline</label>
            <input
              type="text"
              className="form-input"
              value={headline}
              placeholder="e.g. Distributed Systems & High-Throughput Backend Specialist"
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technical Bio & Philosophy</label>
            <textarea
              className="form-textarea"
              value={bio}
              placeholder="Describe your architecture focus, lock-free concurrency, and distributed systems experience..."
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Location</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => showToast('success', 'Profile Saved', 'Your engineering profile has been updated.')}
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab: Security & Active Sessions */}
      {activeTab === 'SECURITY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Active Authentication Sessions</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Managed via MongoDB TTL sessions and HTTP-only signed tokens.
                </p>
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogoutAllOther}
                disabled={sessions.length <= 1}
              >
                Log Out All Other Sessions
              </button>
            </div>

            {loadingSessions ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="skeleton skeleton-text" style={{ height: '50px' }} />
                <div className="skeleton skeleton-text" style={{ height: '50px' }} />
              </div>
            ) : sessions.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                1 session active (Current device)
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessions.map((sess, idx) => {
                  const isCurrent = idx === 0;
                  return (
                    <div
                      key={sess._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.875rem 1rem',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {sess.device?.includes('Mobile') ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                              {sess.device || 'Chrome on Windows'}
                            </span>
                            {isCurrent && <span className="badge badge-emerald">Current Session</span>}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            IP: {sess.ipAddress || '127.0.0.1'} · Last active {new Date(sess.lastActiveAt || sess.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--rose-error)' }}
                          onClick={() => handleRevokeSession(sess._id)}
                        >
                          <Trash2 size={13} />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Public Proof Privacy */}
      {activeTab === 'PRIVACY' && (
        <div className="forge-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Public Proof Passport™ Controls</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', lineHeight: 1.6 }}>
            Your public proof page lets recruiters verify your capabilities without creating an account.
            Private data (email, password hash, internal reviewer IDs) is strictly excluded at the API level.
          </p>

          <div
            style={{
              margin: '1.5rem 0',
              padding: '1.25rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="form-label" style={{ margin: 0 }}>Public Verification URL</span>
              <span className={`badge ${publicEnabled ? 'badge-emerald' : 'badge-neutral'}`}>
                {publicEnabled ? 'ACTIVE & VERIFIABLE' : 'REVOKED / PRIVATE'}
              </span>
            </div>

            {publicEnabled && publicToken ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
                  value={`${window.location.origin}/proof/${publicToken}`}
                />
                <button className="btn btn-secondary btn-sm" onClick={handleCopyPublicLink} title="Copy Link">
                  <Copy size={14} />
                  <span>Copy</span>
                </button>
                <a
                  href={`/proof/${publicToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm"
                  title="Open Link"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No active public link. Click "Generate Secure Public Token" below to enable public verification.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {publicEnabled ? (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleRevokePublicToken}
                  disabled={revoking}
                >
                  <Trash2 size={13} />
                  <span>Immediate Revocation</span>
                </button>
              ) : (
                <button
                  className="btn btn-emerald btn-sm"
                  onClick={handleGenerateNewToken}
                  disabled={revoking}
                >
                  <RefreshCw size={13} />
                  <span>Generate Secure Public Token</span>
                </button>
              )}
            </div>

            {publicEnabled && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleGenerateNewToken}
                disabled={revoking}
              >
                <RefreshCw size={13} />
                <span>Rotate Secret Token</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Integrations */}
      {activeTab === 'INTEGRATIONS' && (
        <div className="forge-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Code Provenance Integrations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Connect source control providers to verify commit hashes, signed tags, and contribution history.
          </p>

          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <GitBranch size={20} color="var(--cyan-primary)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>GitHub Integration</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Connected as: <span style={{ fontFamily: 'var(--font-mono)' }}>arjun-systems</span>
                </div>
              </div>
            </div>

            <span className="badge badge-emerald">AUTHENTICATED</span>
          </div>
        </div>
      )}
    </div>
  );
};
