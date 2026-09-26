import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  Cpu,
  Layers,
  Award,
  ShieldCheck,
  Briefcase,
  Users,
  Settings,
  ArrowRight,
  Sparkles,
  Command,
  FileCode,
} from 'lucide-react';
import { api } from '../api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, extra?: any) => void;
  userRole?: string;
}

interface CommandItem {
  id: string;
  category: 'ACTIONS' | 'CHALLENGES' | 'CAPABILITIES' | 'TALENT';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  userRole,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch challenges for search
  useEffect(() => {
    if (isOpen) {
      api.getChallenges().then((res) => {
        if (res.success && res.challenges) {
          setChallenges(res.challenges);
        }
      });
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(window.location.hash ? window.location.hash : 'search-trigger');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Construct search items
  const baseActions: CommandItem[] = [
    {
      id: 'act-challenges',
      category: 'ACTIONS',
      title: 'Explore Challenge Catalog',
      subtitle: '15 production-grade distributed systems & backend challenges',
      icon: <Cpu size={16} color="var(--cyan-primary)" />,
      onSelect: () => {
        onNavigate('challenges');
        onClose();
      },
    },
    {
      id: 'act-proofgraph',
      category: 'ACTIONS',
      title: 'Open ProofGraph™ Visualizer',
      subtitle: 'Inspect topological evidence relationships and audit proofs',
      icon: <Layers size={16} color="var(--cyan-primary)" />,
      onSelect: () => {
        onNavigate('proofgraph');
        onClose();
      },
    },
    {
      id: 'act-passport',
      category: 'ACTIONS',
      title: 'View Proof Passport™',
      subtitle: 'Verifiable engineering identity and capability score vector',
      icon: <Award size={16} color="var(--emerald-verified)" />,
      onSelect: () => {
        onNavigate('passport');
        onClose();
      },
    },
    {
      id: 'act-recruiter',
      category: 'ACTIONS',
      title: 'Talent Sourcing & Vector Search',
      subtitle: 'Discover verified engineers by benchmark latencies and ADRs',
      icon: <Users size={16} color="#f59e0b" />,
      onSelect: () => {
        onNavigate('recruiter');
        onClose();
      },
    },
    {
      id: 'act-trust',
      category: 'ACTIONS',
      title: 'Inspect Trust Center & Provenance',
      subtitle: 'Four verification pillars, plagiarism indices & AST defenses',
      icon: <ShieldCheck size={16} color="var(--emerald-verified)" />,
      onSelect: () => {
        onNavigate('trust');
        onClose();
      },
    },
    {
      id: 'act-settings',
      category: 'ACTIONS',
      title: 'Account, Security & Privacy Settings',
      subtitle: 'Manage active sessions, public share link, and credentials',
      icon: <Settings size={16} color="var(--text-muted)" />,
      onSelect: () => {
        onNavigate('settings');
        onClose();
      },
    },
  ];

  // Dynamic challenge search items
  const challengeItems: CommandItem[] = challenges.map((c) => ({
    id: `chal-${c._id}`,
    category: 'CHALLENGES',
    title: c.title,
    subtitle: `${c.difficulty} · ${c.domain.replace('_', ' ')} · Target P99: ${c.constraints?.p99LatencyTargetMs || 5}ms`,
    icon: <FileCode size={16} color="var(--cyan-primary)" />,
    onSelect: () => {
      onNavigate('challenges', { selectedSlug: c.slug });
      onClose();
    },
  }));

  // Capability search items
  const capabilityItems: CommandItem[] = [
    {
      id: 'cap-concurrency',
      category: 'CAPABILITIES',
      title: 'Concurrency & Locking',
      subtitle: 'Optimistic locking, Redis atomics, zero-double-booking proofs',
      icon: <Cpu size={16} color="var(--cyan-primary)" />,
      onSelect: () => {
        onNavigate('recruiter', { filterSkill: 'Concurrency' });
        onClose();
      },
    },
    {
      id: 'cap-consensus',
      category: 'CAPABILITIES',
      title: 'Distributed Consensus (Raft)',
      subtitle: 'Leader election, quorum log commits, split-brain healing',
      icon: <Layers size={16} color="var(--purple-accent)" />,
      onSelect: () => {
        onNavigate('recruiter', { filterSkill: 'Distributed Systems' });
        onClose();
      },
    },
    {
      id: 'cap-wal',
      category: 'CAPABILITIES',
      title: 'Write-Ahead Log (WAL) Engines',
      subtitle: 'Crash-safe fsync durability, SSTable segment compaction',
      icon: <Terminal size={16} color="var(--emerald-verified)" />,
      onSelect: () => {
        onNavigate('recruiter', { filterSkill: 'Storage Engines' });
        onClose();
      },
    },
  ];

  const allItems = [...baseActions, ...challengeItems, ...capabilityItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  // Key navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: 0,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyNavigation}
            placeholder="Search challenges, capabilities, candidates, proofs (e.g. 'concurrency', 'raft')..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface-hover)',
              padding: '0.2rem 0.4rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                No matching results for "{query}"
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Try searching for 'Ticket Booking', 'Concurrency', or 'ProofGraph'
              </div>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-dim)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: isSelected ? 'var(--cyan-primary)' : 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div
                          style={{
                            fontSize: '0.6875rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={13} color="var(--cyan-primary)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.625rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span><kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>↑↓</kbd> navigate</span>
            <span><kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>↵</kbd> select</span>
            <span><kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>esc</kbd> close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={11} color="var(--cyan-primary)" />
            <span>ProofForge Command Mesh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
