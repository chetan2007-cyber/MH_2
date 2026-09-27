import React, { useState, useEffect } from 'react';
import {
  X, Send, User, Search, Mail, Shield, Clock, CheckCircle2,
  Sparkles, RefreshCw, Copy, Check, ExternalLink, AlertCircle, UserCheck
} from 'lucide-react';
import { api } from '../../lib/api';
import { applicationService } from '../../services/application.service';
import { useToast } from '../Toast';
import type { Job } from '../../types/api';

interface SendAssessmentModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendAssessmentModal: React.FC<SendAssessmentModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [tab, setTab] = useState<'registered' | 'invite'>('registered');

  // Custom email invite fields
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [notes, setNotes] = useState('Practical engineering assessment assigned by reviewer. Please complete the tasks within the specified duration and submit clean proof artifacts.');

  const [sending, setSending] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccessResult(null);
      fetchCandidates();
    }
  }, [isOpen]);

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await api.get<any[]>('/candidates');
      if (res.data) {
        setCandidates(res.data);
        if (res.data.length > 0 && !selectedCandidate) {
          setSelectedCandidate(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  if (!isOpen || !job) return null;

  const filteredCandidates = candidates.filter(c => {
    const s = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.profession?.toLowerCase().includes(s) ||
      c.domain?.toLowerCase().includes(s)
    );
  });

  const handleSend = async () => {
    setSending(true);
    try {
      const targetJobId = job._id || (job as any).id;
      if (!targetJobId) {
        showToast('error', 'Job Requisition Missing', 'Could not locate job requisition ID.');
        setSending(false);
        return;
      }

      let payload: any = {
        jobId: targetJobId,
        notes,
      };

      let candidateDisplayName = '';

      if (tab === 'registered') {
        if (!selectedCandidate) {
          showToast('error', 'Select a Candidate', 'Please select a candidate to receive this assessment.');
          setSending(false);
          return;
        }
        payload.candidateId = selectedCandidate._id || selectedCandidate.id;
        payload.candidateName = selectedCandidate.name;
        payload.candidateEmail = selectedCandidate.email;
        candidateDisplayName = selectedCandidate.name;
      } else {
        if (!inviteEmail.trim()) {
          showToast('error', 'Email Required', 'Please enter candidate email address.');
          setSending(false);
          return;
        }
        payload.candidateEmail = inviteEmail.trim();
        payload.candidateName = inviteName.trim() || inviteEmail.split('@')[0];
        candidateDisplayName = payload.candidateName;
      }

      const res = await applicationService.assignToCandidate(payload);

      setSuccessResult(res.data?.data || res.data || { candidate: { name: candidateDisplayName } });
      showToast(
        'success',
        'Assessment Dispatched! 🎯',
        `Practical assessment for "${job.title}" has been assigned to ${candidateDisplayName}.`
      );

      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast('error', 'Failed to Send', err.message || 'Could not assign assessment to candidate.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?jobId=${job._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('success', 'Candidate Link Copied', 'Direct candidate assessment application link copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 11000,
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
          maxWidth: 640,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)',
              }}
            >
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Send Assessment to Candidate
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Assign recruiter-uploaded Job DNA assessment directly to a candidate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Job Requisition Target Card */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 12,
              background: 'rgba(5, 150, 105, 0.06)',
              border: '1px solid rgba(5, 150, 105, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.06em' }}>
                Requisition Assessment
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}>
                {job.difficulty || 'Advanced'}
              </span>
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {job.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Department: <strong>{job.department}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} color="#059669" />
                {job.assessmentDurationMinutes || 60} mins
              </span>
            </div>
          </div>

          {successResult ? (
            /* Success State */
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                background: 'var(--bg-subtle)',
                borderRadius: 14,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'rgba(5, 150, 105, 0.15)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  Assessment Dispatched!
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto', lineHeight: 1.5 }}>
                  The practical proof assessment has been assigned to{' '}
                  <strong style={{ color: 'var(--text-main)' }}>
                    {successResult.candidate?.name || 'the candidate'}
                  </strong>.
                  They can now start the assessment from their candidate workspace.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied Link!' : 'Copy Candidate Direct Link'}</span>
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    background: '#059669',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Send Form */
            <>
              {/* Tab Selector: Registered vs Direct Invite */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--bg-subtle)',
                  borderRadius: 10,
                  padding: 4,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setTab('registered')}
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: tab === 'registered' ? 'var(--bg-surface)' : 'transparent',
                    color: tab === 'registered' ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '0.8125rem',
                    fontWeight: tab === 'registered' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: tab === 'registered' ? 'var(--shadow-xs)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <UserCheck size={14} color={tab === 'registered' ? '#059669' : undefined} />
                  <span>Platform Candidates ({candidates.length})</span>
                </button>
                <button
                  onClick={() => setTab('invite')}
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: tab === 'invite' ? 'var(--bg-surface)' : 'transparent',
                    color: tab === 'invite' ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '0.8125rem',
                    fontWeight: tab === 'invite' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: tab === 'invite' ? 'var(--shadow-xs)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Mail size={14} color={tab === 'invite' ? '#059669' : undefined} />
                  <span>Invite by Email</span>
                </button>
              </div>

              {tab === 'registered' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      Select Candidate
                    </label>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {filteredCandidates.length} eligible
                    </span>
                  </div>

                  {/* Search candidate */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Search size={14} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Search candidate by name, profession, or domain..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.8125rem',
                        color: 'var(--text-main)',
                        width: '100%',
                      }}
                    />
                  </div>

                  {/* Candidate List */}
                  <div
                    style={{
                      maxHeight: 180,
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      padding: 6,
                      background: 'var(--bg-surface)',
                    }}
                  >
                    {filteredCandidates.map(c => {
                      const isSelected = selectedCandidate && (selectedCandidate.id === c.id || selectedCandidate._id === c._id);
                      return (
                        <div
                          key={c.id || c._id}
                          onClick={() => setSelectedCandidate(c)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: `1.5px solid ${isSelected ? '#059669' : 'transparent'}`,
                            background: isSelected ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-subtle)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #4f46e5, #059669)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                              }}
                            >
                              {c.name?.substring(0, 2).toUpperCase() || 'CA'}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {c.name}
                              </div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                {c.email} · {c.profession || c.domain || 'Engineer'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {c.proofScore && (
                              <span
                                style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 800,
                                  color: '#059669',
                                  background: 'rgba(5, 150, 105, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                }}
                              >
                                {c.proofScore} Proof Score
                              </span>
                            )}
                            {isSelected && <Check size={16} color="#059669" />}
                          </div>
                        </div>
                      );
                    })}

                    {filteredCandidates.length === 0 && (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        No candidates found matching "{search}". Switch to "Invite by Email" tab to assign to any candidate.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Invite Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Candidate Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Verma"
                      value={inviteName}
                      onChange={e => setInviteName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Candidate Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul.verma@example.com"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Reviewer Note */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Reviewer Assignment Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!successResult && (
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)',
            }}
          >
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Copy size={13} />
              <span>Copy Direct Link</span>
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
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
                onClick={handleSend}
                disabled={sending}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                }}
              >
                {sending ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                <span>{sending ? 'Dispatching...' : 'Send Assessment to Candidate'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
