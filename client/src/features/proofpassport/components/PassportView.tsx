import React, { useEffect, useState } from 'react';
import { Layers, FileCode2, Terminal, CheckCircle2, Award, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { api } from '../../../api';
import { PassportHeader } from './PassportHeader';
import { Badge, Button, Skeleton } from '../../../components/ui';

export interface PassportViewProps {
  onNavigate: (view: string) => void;
}

export const PassportView: React.FC<PassportViewProps> = ({ onNavigate }) => {
  const [passport, setPassport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Canonical Section 19 Passport Data
  const verifiedCapabilities = [
    { name: 'Backend', score: 87, confidence: 'High' },
    { name: 'Testing', score: 91, confidence: 'High' },
    { name: 'System Design', score: 82, confidence: 'High' },
  ];

  const verifiedWork = {
    projectsCount: 6,
    advancedChallengesCount: 3,
    expertReviewsCount: 8,
    adrsDecisionsCount: 14,
  };

  const verifiedProjectsList = [
    {
      title: 'High-Concurrency Ticket Booking API',
      tier: 'Advanced',
      domain: 'Distributed Systems',
      p99: '2.3ms',
      tests: '24/24',
      adrs: 4,
    },
    {
      title: 'Real-Time Order Matching Engine',
      tier: 'Advanced',
      domain: 'Low-Latency C++',
      p99: '0.8ms',
      tests: '26/26',
      adrs: 3,
    },
    {
      title: 'Crash-Safe Write-Ahead Log (WAL)',
      tier: 'Intermediate',
      domain: 'Database Internals',
      p99: '4.1ms',
      tests: '18/18',
      adrs: 3,
    },
    {
      title: 'Zero-Trust OAuth2 & Token Vault',
      tier: 'Intermediate',
      domain: 'Cryptography',
      p99: '1.2ms',
      tests: '20/20',
      adrs: 2,
    },
    {
      title: 'Distributed Consensus with Raft',
      tier: 'Advanced',
      domain: 'Distributed Consensus',
      p99: '3.4ms',
      tests: '30/30',
      adrs: 2,
    },
    {
      title: 'Production V8 Memory Leak Profiler',
      tier: 'Foundation',
      domain: 'Runtime Diagnostics',
      p99: '0.5ms',
      tests: '12/12',
      adrs: 1,
    },
  ];

  const shareUrl = `${window.location.origin}/proof/kaushal-proof-rahul-sharma-87`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header (Avatar, Rahul Sharma, Backend Engineer, Proof Confidence: High, Share Button) */}
      <PassportHeader passport={passport} onShare={() => setShareModalOpen(true)} />

      {/* 2. Top Grid: Verified Capabilities & Verified Work (Section 19) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)', gap: '1.5rem' }}>
        {/* Verified Capabilities */}
        <div className="forge-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Award size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Verified Capabilities
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Algorithmic composites backed by container benchmark runs and peer evaluations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {verifiedCapabilities.map((cap) => (
              <div key={cap.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                    {cap.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {cap.score}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                </div>

                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${cap.score}%`,
                      background: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Work Summary */}
        <div className="forge-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={18} color="var(--emerald-verified)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Verified Work
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Cryptographically anchored production artifacts with zero self-reported claims.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {verifiedWork.projectsCount}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Projects
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                All hermetic suites passed
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--purple-accent)' }}>
                {verifiedWork.advancedChallengesCount}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Advanced challenges
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Top 5% complexity tier
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                {verifiedWork.expertReviewsCount}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Expert reviews
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Double-blind peer audits
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-verified)' }}>
                {verifiedWork.adrsDecisionsCount}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                ADR decisions
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Documented & accepted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Verified Projects Breakdown */}
      <div className="forge-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Verified Production Projects ({verifiedProjectsList.length})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Full codebase provenance and automated benchmarks.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('proofgraph')}>
            <Layers size={14} color="var(--accent-primary)" />
            <span>Interactive ProofGraph</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {verifiedProjectsList.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--purple-accent)', background: 'var(--purple-subtle)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    {p.tier}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.domain}</span>
                </div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                  {p.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.625rem', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--emerald-verified)', fontWeight: 600 }}>P99: {p.p99}</span>
                <span style={{ color: 'var(--text-secondary)' }}>Tests: {p.tests}</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{p.adrs} ADRs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="modal-backdrop" onClick={() => setShareModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Share Engineering Proof Passport
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Anyone with this link can inspect your verified capabilities, container test results, and ADRs without creating an account.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-primary)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary" onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShareModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
