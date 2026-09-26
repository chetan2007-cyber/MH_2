import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Search,
  CheckCircle2,
  FileCode,
  Terminal,
  FileText,
  HelpCircle,
  Users,
  Eye,
  Check,
  ExternalLink,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { BrandLogo } from './layout/BrandLogo';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  user: any;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenAuth, user }) => {
  const [selectedAudience, setSelectedAudience] = useState<'developers' | 'reviewers' | 'recruiters'>('developers');
  const [hoveredProofNode, setHoveredProofNode] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      {/* =========================================================================
          1. HERO SECTION
          "Don't claim your skills. Prove them."
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 0.85fr)',
          gap: '3rem',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '2rem auto 0',
          width: '100%',
        }}
      >
        <div>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-subtle)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              color: 'var(--accent-primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={15} />
            <span>Verifiable Proof-of-Work Engineering Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--text-main)',
              marginBottom: '1.25rem',
            }}
          >
            Don't claim your skills.{' '}
            <span
              style={{
                color: 'var(--accent-primary)',
                display: 'block',
              }}
            >
              Prove them.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '560px',
              marginBottom: '2rem',
            }}
          >
            Build real engineering challenges, document your decisions, and let your work become your strongest hiring signal.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (user && user.role === 'CANDIDATE') onNavigate('challenges');
                else onOpenAuth('register');
              }}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600 }}
            >
              <span>Start Proving</span>
              <ArrowRight size={17} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('recruiter')}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600 }}
            >
              <Search size={17} />
              <span>Explore Talent</span>
            </button>
          </div>

          {/* Social Proof Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--emerald-verified)" />
              <span>Zero resume fluff</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--emerald-verified)" />
              <span>Double-blind audited</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--emerald-verified)" />
              <span>Portable Proof Passport™</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL: Simplified ProofGraph Visual */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 1.75rem',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-verified)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                Topological ProofGraph™
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Signal</span>
          </div>

          {/* Visual Diagram Representation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            {/* Top Root Node: Backend */}
            <div
              onMouseEnter={() => setHoveredProofNode('backend')}
              onMouseLeave={() => setHoveredProofNode(null)}
              style={{
                background: hoveredProofNode === 'backend' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                border: '2px solid var(--accent-primary)',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>Backend Engineering</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Capability Score: 87 · High Confidence</div>
            </div>

            {/* Connecting Vertical Stem & Fork */}
            <div style={{ width: '2px', height: '18px', background: 'var(--border-medium)' }} />

            {/* Middle Triad: API | ADR | Tests */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
              {/* API Node */}
              <div
                onMouseEnter={() => setHoveredProofNode('api')}
                onMouseLeave={() => setHoveredProofNode(null)}
                style={{
                  background: hoveredProofNode === 'api' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <Cpu size={15} color="var(--cyan-primary)" />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>API Engine</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>20k RPS Verified</div>
              </div>

              {/* ADR Node */}
              <div
                onMouseEnter={() => setHoveredProofNode('adr')}
                onMouseLeave={() => setHoveredProofNode(null)}
                style={{
                  background: hoveredProofNode === 'adr' ? 'rgba(124, 58, 237, 0.08)' : 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <FileCode size={15} color="var(--purple-accent)" />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>ADR Decisions</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Redis Lock #03</div>
              </div>

              {/* Tests Node */}
              <div
                onMouseEnter={() => setHoveredProofNode('tests')}
                onMouseLeave={() => setHoveredProofNode(null)}
                style={{
                  background: hoveredProofNode === 'tests' ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <Terminal size={15} color="var(--emerald-verified)" />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Chaos Tests</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>24/24 Passed</div>
              </div>
            </div>

            {/* Connecting Stem */}
            <div style={{ width: '2px', height: '18px', background: 'var(--border-medium)' }} />

            {/* Bottom Target: VERIFIED */}
            <div
              style={{
                background: 'rgba(5, 150, 105, 0.08)',
                border: '1.5px solid var(--emerald-verified)',
                padding: '0.6rem 2rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color="var(--emerald-verified)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--emerald-verified)', letterSpacing: '0.08em' }}>
                VERIFIED PROOF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE PROBLEM SECTION
          “Resumes tell you what someone claims.”
          Resume, Certificates, GitHub activity -> But where is the proof?
          ========================================================================= */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose-error)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          The Hiring Signal Breakdown
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          “Resumes tell you what someone claims.”
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          The industry spends thousands of engineering hours filtering through self-reported bullet points and inflated claims.
        </p>

        {/* Visual Comparison: The Claim Triad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="forge-card" style={{ padding: '1.5rem', textAlign: 'left', opacity: 0.85 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FileText size={18} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Resumes</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Keywords stuffed for ATS parsers and AI-generated buzzwords with zero runtime verification.
            </p>
          </div>

          <div className="forge-card" style={{ padding: '1.5rem', textAlign: 'left', opacity: 0.85 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={18} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Certificates</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Multiple-choice quizzes testing memorized syntax rather than real architectural problem-solving.
            </p>
          </div>

          <div className="forge-card" style={{ padding: '1.5rem', textAlign: 'left', opacity: 0.85 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <GitBranch size={18} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>GitHub Activity</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Green contribution squares that can be gamed with automated cron commits or toy forks.
            </p>
          </div>
        </div>

        {/* The Fundamental Question */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--bg-surface)',
            border: '2px dashed var(--rose-error)',
            padding: '0.85rem 1.75rem',
            borderRadius: 'var(--radius-lg)',
            marginTop: '0.5rem',
          }}
        >
          <HelpCircle size={20} color="var(--rose-error)" />
          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rose-error)' }}>
            But where is the proof?
          </span>
        </div>
      </section>

      {/* =========================================================================
          3. THE SOLUTION SECTION
          BUILD → DOCUMENT → VERIFY → REVIEW → PROVE → DISCOVER
          ========================================================================= */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            The Kaushal Talent Engine
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)' }}>
            The Verifiable Proof Loop
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            {
              step: '01',
              action: 'BUILD',
              desc: 'Solve authentic production challenges under real constraints.',
              icon: <Cpu size={18} color="var(--accent-primary)" />,
            },
            {
              step: '02',
              action: 'DOCUMENT',
              desc: 'Author structured ADRs explaining trade-offs and decisions.',
              icon: <FileCode size={18} color="var(--cyan-primary)" />,
            },
            {
              step: '03',
              action: 'VERIFY',
              desc: 'Pass hermetic container suites and stress benchmarks.',
              icon: <Terminal size={18} color="var(--emerald-verified)" />,
            },
            {
              step: '04',
              action: 'REVIEW',
              desc: 'Receive calibrated evaluations with mandatory code citations.',
              icon: <ShieldCheck size={18} color="var(--purple-accent)" />,
            },
            {
              step: '05',
              action: 'PROVE',
              desc: 'Compile evidence into your topological ProofGraph™.',
              icon: <Layers size={18} color="var(--accent-primary)" />,
            },
            {
              step: '06',
              action: 'DISCOVER',
              desc: 'Recruiters search real capability vectors and hire with confidence.',
              icon: <Search size={18} color="var(--amber-warning)" />,
            },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="forge-card"
              style={{
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.step}
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {item.action}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. AUDIENCE VALUE SECTIONS: DEVELOPERS | REVIEWERS | RECRUITERS
          ========================================================================= */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => setSelectedAudience('developers')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: selectedAudience === 'developers' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: selectedAudience === 'developers' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: selectedAudience === 'developers' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            For Developers
          </button>
          <button
            onClick={() => setSelectedAudience('reviewers')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: selectedAudience === 'reviewers' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: selectedAudience === 'reviewers' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: selectedAudience === 'reviewers' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            For Reviewers
          </button>
          <button
            onClick={() => setSelectedAudience('recruiters')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: selectedAudience === 'recruiters' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: selectedAudience === 'recruiters' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: selectedAudience === 'recruiters' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            For Recruiters
          </button>
        </div>

        {/* Developer Tab Content */}
        {selectedAudience === 'developers' && (
          <div
            className="forge-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.75rem',
            }}
          >
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Cpu size={20} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Build real projects.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tackle high-concurrency ticket engines, distributed consensus, or WAL storage without toy constraints.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileCode size={20} color="var(--cyan-primary)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Document decisions.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Write formal Architecture Decision Records that explain why you rejected alternatives and chose your design.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={20} color="var(--emerald-verified)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Get verified.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Pass automated stress benchmarks and calibrated peer reviews to certify your genuine code ownership.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={20} color="var(--purple-accent)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Build engineering identity.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Own a portable Proof Passport™ that proves what you can actually build to any engineering team globally.
              </p>
            </div>
          </div>
        )}

        {/* Reviewer Tab Content */}
        {selectedAudience === 'reviewers' && (
          <div
            className="forge-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Eye size={20} color="var(--cyan-primary)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inspect.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Examine candidate architecture diagrams, container benchmark latency curves, and code citations in a clean 3-part review workspace.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={20} color="var(--purple-accent)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Evaluate.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Score candidates across an 8-dimension rubric covering Correctness, Architecture, Code Quality, Testing, Security, and Maintainability.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="var(--emerald-verified)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Give evidence-backed feedback.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Every critique links to concrete code line numbers. Reviewers earn Reviewer Reliability Index (RRI) weighting.
              </p>
            </div>
          </div>
        )}

        {/* Recruiter Tab Content */}
        {selectedAudience === 'recruiters' && (
          <div
            className="forge-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Search size={20} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Search capability.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Filter talent by proven capability scores (e.g. Concurrency &gt;= 80, PostgreSQL, Redis) instead of subjective keywords.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Layers size={20} color="var(--cyan-primary)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inspect proof.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Click directly into interactive ProofGraphs to see code, benchmarks, ADRs, and peer comments before booking a single call.
              </p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={20} color="var(--emerald-verified)" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Discover engineers.</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Send direct opportunities targeted at candidates' specific proven capabilities with higher response and conversion rates.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          5. CALL TO ACTION
          ========================================================================= */}
      <section
        style={{
          textAlign: 'center',
          maxWidth: '740px',
          margin: '1rem auto 0',
          padding: '3rem 2rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Ready to let your work speak for you?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Stop writing resumes. Start proving your capabilities with authentic engineering challenges.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (user && user.role === 'CANDIDATE') onNavigate('challenges');
              else onOpenAuth('register');
            }}
          >
            <span>Start Proving Capability</span>
            <ArrowRight size={17} />
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('recruiter')}
          >
            <span>Explore Verified Engineers</span>
          </button>
        </div>
      </section>
    </div>
  );
};
