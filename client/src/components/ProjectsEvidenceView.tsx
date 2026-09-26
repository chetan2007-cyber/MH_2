import React, { useState } from 'react';
import {
  FileCode,
  Layers,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  GitCommit,
  Cpu,
  ArrowRight,
  Database,
  Lock,
  Clock,
  Sparkles,
  GitBranch,
  Activity,
  Code,
  Check,
} from 'lucide-react';
import { Badge, Button } from './ui';

interface ProjectsEvidenceViewProps {
  onNavigate: (view: string, extra?: any) => void;
  onOpenWorkspace: (submissionId: string) => void;
}

export const ProjectsEvidenceView: React.FC<ProjectsEvidenceViewProps> = ({
  onNavigate,
  onOpenWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'PROJECT' | 'LEDGER'>('PROJECT');
  const [activeSection, setActiveSection] = useState<'all' | 'architecture' | 'tech' | 'tests' | 'performance' | 'adrs' | 'reviews' | 'evidence'>('all');

  // Signature Project matching Section 17
  const project = {
    id: '6ab776c6ef1c989d749010c2',
    title: 'High-Concurrency Ticket Booking API',
    status: 'Verified',
    difficulty: 'Advanced',
    domain: 'Distributed Systems',
    commitSha: 'e9a4f21d8b76c543',
    repoUrl: 'https://github.com/rahul-sharma/concurrency-ticket-engine',
    deployedUrl: 'https://ticket-engine-core.internal.kaushal.dev',
    techStack: ['Go 1.22', 'PostgreSQL 16 Partitioned', 'Redis 7.2 Cluster', 'Docker', 'gVisor Hermetic Sandbox'],
    architectureSummary:
      'Engineered an isolated, high-performance ticket decrement service with single-threaded Redis atomic operations and zero-copy buffers. Relational PostgreSQL commits are deferred to background WAL workers to guarantee bounded P99 latencies under flash contention.',
    architectureDetails: {
      dataFlow: 'Client request -> Edge Gateway (Rate limited via Redis Lua) -> Core Worker Pool -> Atomic CAS counter in Redis -> Async event pushed to Kafka/WAL -> PostgreSQL transactional settlement.',
      components: [
        { name: 'Core Worker Pool', role: 'Idempotency checks & request queue', tech: 'Go / gRPC' },
        { name: 'In-Memory CAS Store', role: 'Lock-free version counter in RAM', tech: 'Redis Cluster' },
        { name: 'Durable Ledger', role: 'Append-only transactional log', tech: 'PostgreSQL Partitioned' },
      ],
    },
    performance: {
      p99Latency: '2.3ms',
      throughput: '22,400 req/sec',
      errorRate: '0.00%',
      memoryPeak: '118MB',
    },
    tests: {
      total: 24,
      passed: 24,
      scenarios: [
        'Hidden race condition under 50,000 parallel workers',
        'Redis failover retry with exponential jitter',
        'Database connection pool starvation resilience',
        'Zero overselling invariant under packet drops',
      ],
    },
    adrs: [
      { id: 'ADR-01', title: 'Redis Atomic Decrement vs Row Locks', status: 'Accepted' },
      { id: 'ADR-02', title: 'Exponential Backoff Retry Strategy for Gateway Workers', status: 'Accepted' },
      { id: 'ADR-03', title: 'Use Redis for distributed rate limiting', status: 'Accepted' },
      { id: 'ADR-04', title: 'ThreadSanitizer Race Invariant Validation', status: 'Accepted' },
    ],
    reviews: [
      {
        reviewer: 'Dr. Vikram Malhotra',
        role: 'Senior Staff Distributed Systems Reviewer',
        score: '8.8 / 10',
        comment: 'Superb isolation of stateful mutations. Clean rejection of pessimistic row-locking.',
      },
      {
        reviewer: 'Elena Rostova',
        role: 'Principal Reliability Engineer',
        score: '9.2 / 10',
        comment: 'P99 latency benchmarks in gVisor are rock-solid. Zero data races detected.',
      },
    ],
    timeline: [
      { time: 'Day 1', label: 'Architecture & Boundary Definition', detail: 'Defined component topology & WAL buffer layout', verified: true },
      { time: 'Day 2', label: 'ADR-01 & ADR-02 Accepted', detail: 'Formalized atomic CAS decrements vs row locks', verified: true },
      { time: 'Day 3', label: 'gVisor Stress Benchmarks Passed', detail: 'Sustained 22,400 RPS at 2.3ms P99 latency', verified: true },
      { time: 'Day 4', label: 'Double-Blind Peer Review Passed', detail: 'Calibrated score 8.8/10 with code citations', verified: true },
      { time: 'Today', label: 'Defense Round™ AST Verified', detail: 'AST cross-examination certified genuine ownership', verified: true },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--emerald-verified)',
                background: 'var(--emerald-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(5, 150, 105, 0.25)',
              }}
            >
              ● Status: {project.status}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--purple-accent)',
                background: 'var(--purple-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {project.difficulty}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {project.domain}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {project.title}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', maxWidth: '780px', lineHeight: 1.5, margin: 0 }}>
            {project.architectureSummary}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('proofgraph')}>
            <Layers size={15} color="var(--accent-primary)" />
            <span>View in ProofGraph™</span>
          </button>

          <button className="btn btn-primary" onClick={() => onOpenWorkspace(project.id)}>
            <Terminal size={15} />
            <span>Open in Workspace</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL EVIDENCE TIMELINE (Section 17 Specification)
          ========================================================================= */}
      <div className="forge-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Horizontal Evidence Timeline
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>End-to-End Cryptographic Chain</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {project.timeline.map((step, idx) => (
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
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {step.time}
                  </span>
                  <CheckCircle2 size={15} color="var(--emerald-verified)" />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PROJECT SECTIONS: Architecture, Technology, Tests, Performance, ADRs, Reviews, Evidence
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* 1. Architecture */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Architecture
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {project.architectureDetails.dataFlow}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {project.architectureDetails.components.map((c, i) => (
              <div key={i} style={{ background: 'var(--bg-app)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</span>
                <span style={{ color: 'var(--text-muted)' }}> — {c.role}</span>
                <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>{c.tech}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Technology */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Technology
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <div>Repository: <a href={project.repoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{project.repoUrl}</a></div>
            <div style={{ marginTop: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Commit SHA: {project.commitSha}</div>
          </div>
        </div>

        {/* 3. Performance & Benchmarks */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--emerald-verified)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Performance Benchmarks
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>P99 Latency</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-verified)' }}>{project.performance.p99Latency}</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Throughput</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{project.performance.throughput}</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Error Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{project.performance.errorRate}</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peak RAM</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{project.performance.memoryPeak}</div>
            </div>
          </div>
        </div>

        {/* 4. Tests */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} color="var(--emerald-verified)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Container Tests
              </h3>
            </div>
            <Badge variant="emerald">{project.tests.passed} / {project.tests.total} Passed</Badge>
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
            {project.tests.scenarios.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* 5. ADRs */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode size={18} color="var(--purple-accent)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Architecture Decisions (ADRs)
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.adrs.map((adr) => (
              <div key={adr.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-app)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{adr.id}: {adr.title}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--emerald-verified)', fontWeight: 700 }}>✓ {adr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Reviews */}
        <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Expert Reviews
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {project.reviews.map((rev, i) => (
              <div key={i} style={{ background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rev.reviewer}</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{rev.score}</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{rev.role}</div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>"{rev.comment}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
