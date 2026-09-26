import React, { useState } from 'react';
import {
  Search, Sparkles, LogOut, ChevronRight, Users
} from 'lucide-react';
import { RecruiterSearch } from './RecruiterSearch';
import { RecruiterDossier } from './RecruiterDossier';
import { RecruiterCompare } from './RecruiterCompare';

type RecruiterView = 'discover' | 'dossier' | 'compare';

interface RecruiterShellProps {
  user: any;
  onLogout: () => void;
}

export const RecruiterShell: React.FC<RecruiterShellProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<RecruiterView>('discover');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);

  const handleViewDossier = (candidate: any) => {
    setSelectedCandidate(candidate);
    setView('dossier');
  };

  const handleAddToCompare = (candidate: any) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.id === candidate.id);
      if (exists) return prev.filter(c => c.id !== candidate.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, candidate];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>

      {/* ── RECRUITER TOP BAR ── */}
      <header style={{
        height: 56, background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
              color: 'var(--text-main)', letterSpacing: '-0.03em'
            }}>kaushal</span>
            <span style={{
              fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '2px 8px',
              background: 'var(--bg-subtle)', borderRadius: 99, border: '1px solid var(--border-subtle)'
            }}>Talent Intelligence</span>
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { id: 'discover', label: 'Discover', icon: Search },
              { id: 'dossier', label: 'Candidate Dossier', icon: Users, disabled: !selectedCandidate },
              { id: 'compare', label: `Compare${compareList.length > 0 ? ` (${compareList.length})` : ''}`, icon: ChevronRight, disabled: compareList.length < 2 },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => !tab.disabled && setView(tab.id as RecruiterView)}
                disabled={tab.disabled}
                style={{
                  padding: '5px 14px', borderRadius: 7, border: 'none',
                  background: view === tab.id ? 'var(--accent-subtle)' : 'transparent',
                  color: view === tab.id ? 'var(--accent-primary)'
                    : tab.disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
                  fontSize: '0.875rem', fontWeight: view === tab.id ? 700 : 500,
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user?.name || 'Priya Nair'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Talent Partner · Acme Corp
            </div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: 800, color: '#fff'
          }}>
            {(user?.name || 'P').charAt(0)}
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
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {view === 'discover' && (
          <RecruiterSearch
            onViewDossier={handleViewDossier}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
            onGoCompare={() => setView('compare')}
          />
        )}
        {view === 'dossier' && selectedCandidate && (
          <RecruiterDossier
            candidate={selectedCandidate}
            onBack={() => setView('discover')}
            onAddToCompare={() => handleAddToCompare(selectedCandidate)}
            inCompareList={compareList.some(c => c.id === selectedCandidate?.id)}
          />
        )}
        {view === 'compare' && compareList.length >= 2 && (
          <RecruiterCompare
            candidates={compareList}
            onRemove={(id) => setCompareList(prev => prev.filter(c => c.id !== id))}
            onViewDossier={handleViewDossier}
          />
        )}
      </div>
    </div>
  );
};
