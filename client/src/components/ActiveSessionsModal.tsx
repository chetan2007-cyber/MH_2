import React, { useEffect, useState } from 'react';
import { X, Monitor, Smartphone, Globe, Shield, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../api';

interface ActiveSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveSessionsModal: React.FC<ActiveSessionsModalProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.getSessions();
      if (res.success) {
        setSessions(res.sessions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRevoke = async (id: string) => {
    try {
      const res = await api.revokeSession(id);
      if (res.success) {
        setMessage('Session invalidated.');
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutAllOther = async () => {
    try {
      const res = await api.logoutAll();
      if (res.success) {
        setMessage(res.message || null);
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="var(--cyan-primary)" /> Active Sessions & Device Security
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Inspect and revoke active authenticated sessions tied to your account.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {message && (
          <div style={{ background: 'var(--emerald-subtle)', border: '1px solid var(--emerald-verified)', color: '#6ee7b7', padding: '0.625rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto', marginBottom: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading active sessions...</div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No other active sessions.</div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: s.isCurrent ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: s.isCurrent ? 'var(--cyan-subtle)' : 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.isCurrent ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {s.deviceInfo?.device === 'Mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {s.deviceInfo?.browser || 'Browser'} on {s.deviceInfo?.os || 'OS'}
                      </span>
                      {s.isCurrent && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Current Session</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>IP: {s.ipAddress}</span>
                      <span>•</span>
                      <span>Last active: {new Date(s.lastActiveAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {!s.isCurrent && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--rose-danger)', borderColor: 'var(--border-subtle)' }}
                    onClick={() => handleRevoke(s.id)}
                  >
                    <Trash2 size={13} /> Revoke
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchSessions} disabled={loading}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="btn btn-secondary btn-sm" style={{ color: 'var(--rose-danger)' }} onClick={handleLogoutAllOther}>
            Log Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
};
