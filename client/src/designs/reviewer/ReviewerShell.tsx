import React, { useState } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, Sparkles,
  ChevronRight, FileText, Cpu, Shield, BarChart2,
  GitCommit, MessageSquare, Layers, User, LogOut
} from 'lucide-react';
import { ReviewerQueue } from './ReviewerQueue';
import { ReviewerInspector } from './ReviewerInspector';

type ReviewerView = 'queue' | 'job_dna' | 'inspect';

interface ReviewerShellProps {
  user: any;
  onLogout: () => void;
}

export const ReviewerShell: React.FC<ReviewerShellProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<ReviewerView>('queue');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const handleInspect = (submission: any) => {
    setSelectedSubmission(submission);
    setView('inspect');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>

      {/* ── REVIEWER TOPBAR ── */}
      <header style={{
        height: 56, background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
              color: 'var(--text-main)', letterSpacing: '-0.03em' }}>kaushal</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '2px 8px',
              background: 'var(--bg-subtle)', borderRadius: 99, border: '1px solid var(--border-subtle)' }}>
              Reviewer
            </span>
          </div>

          {/* View tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { id: 'queue', label: 'Review Queue' },
              { id: 'job_dna', label: 'Job DNA & Requisitions' },
              { id: 'inspect', label: 'Inspection', disabled: !selectedSubmission },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => !tab.disabled && setView(tab.id as ReviewerView)}
                disabled={tab.disabled}
                style={{
                  padding: '5px 14px', borderRadius: 7, border: 'none',
                  background: view === tab.id ? 'var(--accent-subtle)' : 'transparent',
                  color: view === tab.id ? 'var(--accent-primary)' : tab.disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
                  fontSize: '0.875rem', fontWeight: view === tab.id ? 700 : 500,
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Right: User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user?.name || 'Dr. Vikram Malhotra'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Reliability Rating: <strong style={{ color: 'var(--emerald-verified)' }}>9.2</strong>
            </div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: 800, color: '#fff'
          }}>
            {(user?.name || 'V').charAt(0)}
          </div>
          <button onClick={onLogout} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 6, borderRadius: 6
          }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflowY: view === 'inspect' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {view === 'queue' && (
          <ReviewerQueue onInspect={handleInspect} initialTab="submissions" />
        )}
        {view === 'job_dna' && (
          <ReviewerQueue onInspect={handleInspect} initialTab="job_dna" />
        )}
        {view === 'inspect' && selectedSubmission && (
          <ReviewerInspector
            submission={selectedSubmission}
            onBack={() => setView('queue')}
          />
        )}
      </div>
    </div>
  );
};
