import React, { useState } from 'react';
import {
  Search, Shield, CheckCircle2, ChevronRight,
  GitCommit, FileText, ArrowRight, Layers, Plus, X, Sparkles,
  Palette, TrendingUp, Megaphone, Users, GraduationCap, Wrench, Activity, Code2,
  RefreshCw, AlertCircle
} from 'lucide-react';
import { CAREER_DOMAINS } from '../../data/careerTaxonomy';
import { useCandidates } from '../../hooks/useCandidates';
import type { CandidateProfile } from '../../types/api';
import { JobRequisitionsView } from '../../components/recruiter/JobRequisitionsView';
import { ApplicationsPipelineView } from '../../components/recruiter/ApplicationsPipelineView';
import { RecruiterAnalyticsView } from '../../components/recruiter/RecruiterAnalyticsView';

const SUGGESTION_QUERIES = [
  'Graphic Designer with brand identity & design system',
  'Musician with original compositions and multitrack stems',
  'Accountant with ledger audit and financial models',
  'Teacher with curriculum design and lesson demonstrations',
  'Backend developer with high-throughput Redis architecture',
  'Mechanical Engineer with CAD simulation and stress analysis',
  'Marketing strategist with conversion analytics and SEO audit',
  'Clinical Research Associate with trial documentation',
];

interface CandidateCardProps {
  c: CandidateProfile;
  onView: () => void;
  onCompare: () => void;
  inCompare: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ c, onView, onCompare, inCompare }) => {
  const [hovered, setHovered] = useState(false);

  const getDomainIcon = (domainName: string) => {
    switch (domainName?.toLowerCase()) {
      case 'technology': return <Code2 size={12} />;
      case 'creative': return <Palette size={12} />;
      case 'finance & banking': return <TrendingUp size={12} />;
      case 'marketing & sales': return <Megaphone size={12} />;
      case 'hr & administration': return <Users size={12} />;
      case 'education': return <GraduationCap size={12} />;
      case 'engineering / core': return <Wrench size={12} />;
      case 'healthcare / life sciences': return <Activity size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  const gradientFrom = c.gradientFrom || '#4f46e5';
  const gradientTo = c.gradientTo || '#7c3aed';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        borderRadius: 14,
        padding: '1.5rem',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Domain badge + Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: gradientFrom,
            background: `${gradientFrom}14`,
            padding: '3px 8px',
            borderRadius: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {getDomainIcon(c.domain)}
          {c.domain}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {c.location || 'Remote Verified'}
        </span>
      </div>

      {/* Header: Avatar + name + headline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {c.initials || c.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {c.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1,
                }}
              >
                {c.proofScore}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            {c.headline}
          </p>
        </div>
      </div>

      {/* Proof evidence counts */}
      <div
        style={{
          display: 'flex',
          gap: '0.875rem',
          marginBottom: '1.25rem',
          padding: '0.875rem',
          background: 'var(--bg-subtle)',
          borderRadius: 9,
        }}
      >
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            alignSelf: 'center',
            marginRight: 'auto',
          }}
        >
          Proven through
        </div>
        {[
          { label: 'Artifacts', value: c.verifiedProjects || 0, color: gradientFrom },
          { label: 'Reviews', value: c.expertReviews || 0, color: '#059669' },
          { label: 'Defenses', value: c.defenseRounds || 0, color: '#d97706' },
        ].map((ev) => (
          <div key={ev.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: ev.color,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
              }}
            >
              {ev.value}
            </div>
            <div
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: 2,
              }}
            >
              {ev.label}
            </div>
          </div>
        ))}
      </div>

      {/* Capability bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(c.capabilities || []).map((cap) => (
          <div key={cap.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {cap.label}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cap.score}
              </span>
            </div>
            <div style={{ height: 5, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${cap.score}%`,
                  background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent proof */}
      {c.recentProof && (
        <div
          style={{
            padding: '0.75rem',
            background: 'var(--bg-subtle)',
            borderRadius: 8,
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: '0.375rem',
            }}
          >
            Primary Evidence Artifact
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {c.recentProof.title}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: '#059669',
                background: 'rgba(5,150,105,0.1)',
                padding: '2px 6px',
                borderRadius: 3,
                flexShrink: 0,
              }}
            >
              {c.recentProof.status}
            </span>
          </div>
          {(c.techDecision || c.keyDecision) && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Core rationale:</strong> {c.techDecision || c.keyDecision}
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(c.tags || []).slice(0, 4).map((t) => (
          <span
            key={t}
            style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)',
              padding: '2px 6px',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem', marginTop: 'auto' }}>
        <button
          onClick={onCompare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            border: `1px solid ${inCompare ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            background: inCompare ? 'var(--accent-subtle)' : 'transparent',
            color: inCompare ? 'var(--accent-primary)' : 'var(--text-muted)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          {inCompare ? <X size={13} /> : <Plus size={13} />}
          {inCompare ? 'Remove' : 'Compare'}
        </button>
        <button
          onClick={onView}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            flex: 1,
            padding: '8px 14px',
            background: hovered ? 'var(--text-main)' : 'var(--bg-subtle)',
            color: hovered ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
          }}
        >
          View Proof <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

interface RecruiterSearchProps {
  onViewDossier: (c: any) => void;
  onAddToCompare: (c: any) => void;
  compareList: any[];
  onGoCompare: () => void;
}

export const RecruiterSearch: React.FC<RecruiterSearchProps> = ({
  onViewDossier,
  onAddToCompare,
  compareList,
  onGoCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'discovery' | 'requisitions' | 'pipeline' | 'analytics'>('discovery');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');

  // Live Hook
  const { candidates, loading, error, refetch } = useCandidates({
    domain: selectedDomainFilter !== 'All' ? selectedDomainFilter : undefined,
    search: query || undefined,
  });

  const handleSearch = (q?: string) => {
    if (q !== undefined) setQuery(q);
    setSearched(true);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* ── RECRUITER SUB-NAV TABS ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 2rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setActiveTab('discovery')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'discovery' ? 'var(--text-main)' : 'transparent',
            color: activeTab === 'discovery' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Talent Discovery
        </button>

        <button
          onClick={() => setActiveTab('requisitions')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'requisitions' ? 'var(--text-main)' : 'transparent',
            color: activeTab === 'requisitions' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Job DNA & Requisitions
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'pipeline' ? 'var(--text-main)' : 'transparent',
            color: activeTab === 'pipeline' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Pipeline & Shortlist
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'analytics' ? 'var(--text-main)' : 'transparent',
            color: activeTab === 'analytics' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Talent Analytics
        </button>
      </div>

      {activeTab === 'requisitions' && (
        <div style={{ padding: '2rem' }}>
          <JobRequisitionsView />
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div style={{ padding: '2rem' }}>
          <ApplicationsPipelineView />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ padding: '2rem' }}>
          <RecruiterAnalyticsView />
        </div>
      )}

      {activeTab === 'discovery' && (
        <>
          {/* ── SEARCH HERO (pre-search) ── */}
          {!searched && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 110px)',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
          <div style={{ marginBottom: '2.5rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent-primary)',
                marginBottom: '0.875rem',
              }}
            >
              Multidisciplinary Talent Intelligence
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'var(--text-main)',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}
            >
              Find professionals by what<br />they can actually prove.
            </h1>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: 520 }}>
              Search verified capability across Engineering, Creative, Finance, Marketing, Education, HR & Healthcare.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ width: '100%', maxWidth: 640, position: 'relative', marginBottom: '1.5rem' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by role, domain, artifact type, or capability (e.g. Graphic Designer, Musician, Redis, Audit)..."
              style={{
                width: '100%',
                padding: '16px 18px 16px 50px',
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: 14,
                fontSize: '0.9375rem',
                color: 'var(--text-main)',
                outline: 'none',
                boxShadow: 'var(--shadow-lg)',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-medium)';
              }}
            />
            <button
              onClick={() => handleSearch()}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                padding: '9px 20px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </div>

          {/* Career Domain Quick Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 700, marginBottom: '1.5rem' }}>
            {CAREER_DOMAINS.map((dom) => (
              <button
                key={dom.id}
                onClick={() => {
                  setSelectedDomainFilter(dom.name);
                  setSearched(true);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = dom.color;
                  e.currentTarget.style.color = dom.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
              >
                <span style={{ color: dom.color }}>●</span>
                {dom.name}
              </button>
            ))}
          </div>

          {/* Suggestion queries */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 660 }}>
            {SUGGESTION_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 999,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {searched && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem 2rem 4rem' }}>
          {/* Results header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 3 }}>
                Search Query: "{query || 'All verified professionals'}"
              </p>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.03em',
                }}
              >
                {loading ? 'Searching backend...' : `${candidates.length} verified candidate${candidates.length === 1 ? '' : 's'} found`}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              {compareList.length >= 2 && (
                <button
                  onClick={onGoCompare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '9px 18px',
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 9,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  Compare {compareList.length} candidates <ArrowRight size={14} />
                </button>
              )}
              <button
                onClick={() => {
                  setSearched(false);
                  setSelectedDomainFilter('All');
                  setQuery('');
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 9,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                New search
              </button>
            </div>
          </div>

          {/* Career Domain Filter Strip */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
              Filter Domain:
            </span>
            <button
              onClick={() => setSelectedDomainFilter('All')}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: `1px solid ${selectedDomainFilter === 'All' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                background: selectedDomainFilter === 'All' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: selectedDomainFilter === 'All' ? '#fff' : 'var(--text-main)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              All Domains
            </button>
            {CAREER_DOMAINS.map((dom) => {
              const isSelected = selectedDomainFilter === dom.name;
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomainFilter(dom.name)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    border: `1px solid ${isSelected ? dom.color : 'var(--border-subtle)'}`,
                    background: isSelected ? dom.color : 'var(--bg-surface)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {dom.name}
                </button>
              );
            })}
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={20} color="#ef4444" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Candidate search failed</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{error}</div>
                </div>
              </div>
              <button
                onClick={() => refetch()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
                  color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 280, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14 }} />
              ))}
            </div>
          )}

          {/* Candidate grid */}
          {!loading && !error && candidates.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  c={c}
                  onView={() => onViewDossier(c)}
                  onCompare={() => onAddToCompare(c)}
                  inCompare={compareList.some((cl) => cl.id === c.id)}
                />
              ))}
            </div>
          )}

          {!loading && !error && candidates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: 14, border: '1px dashed var(--border-subtle)' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                No candidate found matching "{query}" in {selectedDomainFilter}.
              </p>
              <button
                onClick={() => { setSelectedDomainFilter('All'); setQuery(''); }}
                style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )}
</div>
);
};
