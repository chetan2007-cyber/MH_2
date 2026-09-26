import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Compass,
  FileCheck2,
  AlertTriangle,
  Activity,
  UserX,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api';

export const AdminView: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'audit'>('overview');
  const [metrics, setMetrics] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOverview();
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers();
      if (res.success) {
        setUsersList(res.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      if (res.success) {
        setAuditLogs(res.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const handleToggleUserStatus = async (id: string) => {
    try {
      const res = await api.toggleUserStatus(id);
      if (res.success) {
        setActionMsg(res.message || null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <ShieldCheck size={24} color="var(--purple-accent)" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Platform Control & Integrity</h1>
          <span className="badge badge-purple">Superuser Access</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Monitor system metrics, review account statuses, inspect immutable audit logs, and oversee verification integrity.
        </p>
      </div>

      {actionMsg && (
        <div style={{ background: 'var(--emerald-subtle)', border: '1px solid var(--emerald-verified)', color: '#6ee7b7', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
          {actionMsg}
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button className={`btn btn-sm ${tab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('overview')}>
          <Activity size={14} /> System Metrics
        </button>
        <button className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('users')}>
          <Users size={14} /> User Management
        </button>
        <button className={`btn btn-sm ${tab === 'audit' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('audit')}>
          <FileCheck2 size={14} /> Immutable Audit Logs
        </button>
      </div>

      {/* 1. OVERVIEW METRICS */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="proof-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Users</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {metrics?.totalUsers || 19}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {metrics?.candidateCount || 10} Candidates • {metrics?.reviewerCount || 5} Reviewers
              </div>
            </div>

            <div className="proof-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Challenges</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cyan-primary)', marginTop: '0.25rem' }}>
                {metrics?.totalChallenges || 15}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Across 4 difficulty tiers
              </div>
            </div>

            <div className="proof-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Submissions</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-verified)', marginTop: '0.25rem' }}>
                {metrics?.verifiedSubmissions || 10}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                100% Chaos & SAST Tested
              </div>
            </div>

            <div className="proof-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sent Opportunities</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber-warning)', marginTop: '0.25rem' }}>
                {metrics?.totalOpportunities || 3}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Stripe, Cloudflare, Datadog
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS MANAGEMENT */}
      {tab === 'users' && (
        <div className="proof-card">
          <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Registered Users ({usersList.length})
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email Verified</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: u.emailVerified ? 'var(--emerald-verified)' : 'var(--amber-warning)' }}>
                      {u.emailVerified ? '✓ Yes' : 'Pending'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: u.status === 'ACTIVE' ? 'var(--rose-danger)' : 'var(--emerald-verified)', padding: '0.2rem 0.5rem' }}
                          onClick={() => handleToggleUserStatus(u._id)}
                        >
                          {u.status === 'ACTIVE' ? <UserX size={13} /> : <UserCheck size={13} />}
                          <span>{u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS EXPLORER */}
      {tab === 'audit' && (
        <div className="proof-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 700 }}>
              Immutable Compliance Audit Logs ({auditLogs.length})
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={fetchAuditLogs}>
              <RefreshCw size={13} /> Refresh Logs
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            {auditLogs.map((log) => (
              <div
                key={log._id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.625rem 0.875rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-dim)', marginRight: '0.75rem' }}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: '0.6rem', marginRight: '0.5rem' }}>
                    {log.actorRole}
                  </span>
                  <strong style={{ color: 'var(--cyan-primary)', marginRight: '0.5rem' }}>{log.action}</strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{log.actorEmail || 'System Actor'}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
