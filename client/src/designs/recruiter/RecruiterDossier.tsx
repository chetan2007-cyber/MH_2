import React, { useState } from 'react';
import {
  ChevronLeft, CheckCircle2, GitCommit, FileText,
  Shield, BarChart2, ArrowRight, Calendar, Plus, X, Send,
  Sparkles, Layers, Award, PlayCircle, Eye, Download, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { opportunityService } from '../../services/opportunity.service';
import type { CandidateProfile } from '../../types/api';

interface RecruiterDossierProps {
  candidate: CandidateProfile | any;
  onBack: () => void;
  onAddToCompare: () => void;
  inCompareList: boolean;
}

export const RecruiterDossier: React.FC<RecruiterDossierProps> = ({
  candidate,
  onBack,
  onAddToCompare,
  inCompareList,
}) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Specialist');
  const [isSending, setIsSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  if (!candidate) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>No candidate selected.</p>
        <button onClick={onBack} style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
          Back to discovery
        </button>
      </div>
    );
  }

  const c = candidate;

  const getTimelineEvents = () => {
    const domain = c.domain?.toLowerCase() || 'technology';
    if (domain.includes('creative')) {
      return [
        { type: 'Joined', date: 'Oct 2024', label: 'Joined Kaushal Creative Network' },
        { type: 'Brief', date: 'Nov 2024', label: 'Accepted Brief: Brand Visual Identity', color: c.gradientFrom },
        { type: 'Iteration', date: 'Dec 2024', label: '14 Iteration Boards & Typography Exploration', color: '#7c3aed' },
        { type: 'Review', date: 'Jan 2025', label: 'Creative Peer Review — 9.3/10', color: '#059669' },
        { type: 'Defense', date: 'Jan 2025', label: 'Creative Defense: Defended visual contrast and hierarchy', color: '#d97706' },
        { type: 'Verified', date: 'Feb 2025', label: 'Verified Capability: Visual Design Systems', color: '#059669' },
      ];
    } else if (domain.includes('finance')) {
      return [
        { type: 'Joined', date: 'Oct 2024', label: 'Joined Kaushal Finance Network' },
        { type: 'Model', date: 'Nov 2024', label: 'Completed: Multi-Tier LBO Financial Model', color: c.gradientFrom },
        { type: 'Audit', date: 'Dec 2024', label: 'Forensic Audit Paper: Discovered ledger anomaly variance', color: '#7c3aed' },
        { type: 'Review', date: 'Jan 2025', label: 'CPA Expert Review — 9.2/10', color: '#059669' },
        { type: 'Defense', date: 'Jan 2025', label: 'Defense Round: Defended discount rate & risk assumptions', color: '#d97706' },
      ];
    }
    return [
      { type: 'Joined', date: 'Nov 2024', label: 'Joined Kaushal' },
      { type: 'Project', date: 'Dec 2024', label: `Completed: ${c.recentProof?.title || 'System Implementation'}`, color: c.gradientFrom },
      { type: 'Decision', date: 'Dec 2024', label: `Decision Log: ${c.techDecision || c.keyDecision || 'Architecture Decision'}`, color: '#7c3aed' },
      { type: 'Review', date: 'Jan 2025', label: 'Expert Peer Review — 9.1/10 by Domain Auditors', color: '#059669' },
      { type: 'Defense', date: 'Jan 2025', label: 'Technical Defense Passed — High Reasoning Confidence', color: '#d97706' },
    ];
  };

  const timelineEvents = getTimelineEvents();

  const handleSendInvite = async () => {
    if (!inviteMessage.trim()) return;
    setIsSending(true);
    setSendError(null);
    try {
      const res = await opportunityService.sendOpportunity({
        candidateId: c.id || c._id,
        roleTitle: roleTitle,
        message: inviteMessage,
      });
      if (res.success || !res.error) {
        setInviteSent(true);
        setTimeout(() => {
          setInviteOpen(false);
          setInviteSent(false);
          setInviteMessage('');
        }, 1500);
      } else {
        setSendError(res.error || 'Failed to dispatch outreach opportunity.');
      }
    } catch (err: any) {
      setSendError(err.message || 'Error sending opportunity.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            padding: 0,
          }}
        >
          <ChevronLeft size={15} /> Back to candidate discovery
        </button>

        {/* ── DOSSIER HEADER ── */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ height: 4, background: `linear-gradient(90deg, ${c.gradientFrom || '#4f46e5'}, ${c.gradientTo || '#7c3aed'})` }} />
          <div style={{ padding: '1.75rem 2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${c.gradientFrom || '#4f46e5'}, ${c.gradientTo || '#7c3aed'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {c.initials || c.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h1
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 900,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.035em',
                        lineHeight: 1.1,
                        margin: 0,
                      }}
                    >
                      {c.name}
                    </h1>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: `${c.gradientFrom || '#4f46e5'}15`,
                        color: c.gradientFrom || '#4f46e5',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {c.domain}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {c.headline}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: '0.625rem', flexWrap: 'wrap' }}>
                    {(c.tags || []).map((t: string) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          background: 'var(--bg-subtle)',
                          padding: '3px 8px',
                          borderRadius: 5,
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions & Proof Score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1,
                      }}
                    >
                      {c.proofScore}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      PROOF SCORE / 100
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <button
                    onClick={onAddToCompare}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      border: `1px solid ${inCompareList ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: inCompareList ? 'var(--accent-subtle)' : 'transparent',
                      color: inCompareList ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  >
                    {inCompareList ? <X size={13} /> : <Plus size={13} />}
                    {inCompareList ? 'In Compare' : 'Compare'}
                  </button>

                  <button
                    onClick={() => setInviteOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 16px',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    <Send size={13} /> Reach Out
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Evidence Summary Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--bg-subtle)',
                borderRadius: 12,
              }}
            >
              {[
                { label: 'Verified Deliverables', value: c.verifiedProjects || 0, icon: FileText, color: c.gradientFrom || '#4f46e5' },
                { label: 'Expert Peer Audits', value: c.expertReviews || 0, icon: CheckCircle2, color: '#059669' },
                { label: 'Defense Interrogations', value: c.defenseRounds || 0, icon: Shield, color: '#d97706' },
                { label: 'Talent Availability', value: c.availability || 'Open', icon: Award, color: '#0284c7' },
              ].map((ev) => (
                <div key={ev.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: `${ev.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: ev.color,
                    }}
                  >
                    <ev.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {ev.value}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>{ev.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY: Capabilities + Timeline ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
          {/* Left: Capabilities + Verified Deliverables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Capabilities */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <h2
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                Profession-Specific Capability Breakdown ({c.domain})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(c.capabilities || []).map((cap: any) => (
                  <div key={cap.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {cap.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 800,
                          color: c.gradientFrom || '#4f46e5',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {cap.score}/100
                      </span>
                    </div>
                    <div style={{ height: 7, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${cap.score}%`,
                          background: `linear-gradient(90deg, ${c.gradientFrom || '#4f46e5'}, ${c.gradientTo || '#7c3aed'})`,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Evidence Artifact */}
            {c.recentProof && (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      letterSpacing: '-0.02em',
                      margin: 0,
                    }}
                  >
                    Authentic Evidence & Artifacts
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ● Peer Verified
                  </span>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 10,
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: c.gradientFrom || '#4f46e5', textTransform: 'uppercase' }}>
                        Primary Submission
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>
                        {c.recentProof.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        background: 'rgba(5,150,105,0.1)',
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}
                    >
                      9.2 / 10 Score
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px' }}>
                    <strong>Key Methodology / Decision:</strong> {c.techDecision || c.keyDecision || 'Documented rationale.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Timeline */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 14,
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xs)',
              height: 'fit-content',
            }}
          >
            <h2
              style={{
                fontSize: '0.9375rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}
            >
              Verification History
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 7,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: 'var(--border-subtle)',
                }}
              />
              {timelineEvents.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: ev.color || 'var(--accent-primary)',
                      border: '3px solid var(--bg-surface)',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {ev.date} · {ev.type}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2, lineHeight: 1.3 }}>
                      {ev.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reach Out Modal */}
        {inviteOpen && (
          <div className="modal-backdrop" onClick={() => setInviteOpen(false)} style={{ zIndex: 1200 }}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                Reach out to {c.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Initiate direct contact based on verified {c.domain} proof points.
              </p>

              {sendError && (
                <div style={{ fontSize: '0.8125rem', color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={14} /> {sendError}
                </div>
              )}

              {inviteSent ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>Message Dispatched</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{c.name} will receive your verification-backed invitation.</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={e => setRoleTitle(e.target.value)}
                      placeholder="e.g. Senior Distributed Systems Engineer"
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: 8,
                        border: '1px solid var(--border-medium)', background: 'var(--bg-app)',
                        color: 'var(--text-main)', fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Invitation Message
                    </label>
                    <textarea
                      rows={4}
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder={`Hi ${c.name}, we were impressed by your verified ${c.recentProof?.title || 'work'} submission and would love to discuss...`}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 8,
                        border: '1px solid var(--border-medium)', background: 'var(--bg-app)',
                        color: 'var(--text-main)', fontSize: '0.875rem',
                        fontFamily: 'var(--font-sans)', outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setInviteOpen(false)}
                      style={{ padding: '8px 14px', border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--bg-surface)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSending || !inviteMessage.trim()}
                      onClick={handleSendInvite}
                      className="btn-primary"
                      style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.8125rem' }}
                    >
                      {isSending ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                      {isSending ? 'Sending...' : 'Send Invitation'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
