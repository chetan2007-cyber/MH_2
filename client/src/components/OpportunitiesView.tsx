import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, XCircle, HelpCircle, Building2, Send, Clock } from 'lucide-react';
import { api } from '../api';

export const OpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunities();
      if (res.success) {
        setOpportunities(Array.isArray(res.data) ? res.data : (res as any).opportunities || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleRespond = async (oppId: string, status: any, notes?: string) => {
    try {
      const res = await api.respondOpportunity(oppId, status, notes);
      if (res.success) {
        setActionMsg(`Opportunity marked as ${status}.`);
        setActiveQuestionId(null);
        setQuestionText('');
        fetchOpportunities();
      } else {
        alert(res.error || 'Failed to update opportunity.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Briefcase size={24} color="var(--cyan-primary)" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Inbound Opportunities Pipeline</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Direct hiring outreach extended by engineering organizations specifically referencing your verified project evidence.
        </p>
      </div>

      {actionMsg && (
        <div style={{ background: 'var(--emerald-subtle)', border: '1px solid var(--emerald-verified)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="proof-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No opportunities received yet. Complete and verify challenges to surface on the Recruiter Evidence Feed.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {opportunities.map((opp) => (
            <div key={opp._id} className="proof-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-primary)',
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1875rem', fontWeight: 700 }}>{opp.roleTitle}</h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{opp.organizationId?.name || 'Verified Tech Org'}</strong>
                      <span>•</span>
                      <span>{opp.compensationRange}</span>
                      <span>•</span>
                      <span>{opp.locationType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`badge ${
                      opp.status === 'ACCEPTED'
                        ? 'badge-emerald'
                        : opp.status === 'DECLINED'
                        ? 'badge-gray'
                        : opp.status === 'QUESTION_ASKED'
                        ? 'badge-purple'
                        : 'badge-cyan'
                    }`}
                  >
                    {opp.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Why We Reached Out Box */}
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan-primary)', marginBottom: '0.35rem' }}>
                  Why We Reached Out (Evidence Citation):
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  "{opp.whyReachedOut}"
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {opp.skillsMatched?.map((s: string) => (
                    <span key={s} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {opp.status === 'SENT' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleRespond(opp._id, 'DECLINED')}>
                    <XCircle size={14} /> Decline
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveQuestionId(activeQuestionId === opp._id ? null : opp._id)}>
                    <HelpCircle size={14} /> Ask Architectural Question
                  </button>
                  <button className="btn btn-emerald btn-sm" onClick={() => handleRespond(opp._id, 'ACCEPTED')}>
                    <CheckCircle2 size={14} /> Accept & Advance to Fast-Track Interview
                  </button>
                </div>
              )}

              {/* Question Drawer */}
              {activeQuestionId === opp._id && (
                <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', marginTop: '0.5rem' }}>
                  <label className="input-label">Inquire about team tech stack, deployment scale, or team dynamics:</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="e.g. What database isolation level are you using on your primary billing cluster?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveQuestionId(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleRespond(opp._id, 'QUESTION_ASKED', questionText)}
                      disabled={!questionText.trim()}
                    >
                      <Send size={14} /> Send Question to Hiring Lead
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
