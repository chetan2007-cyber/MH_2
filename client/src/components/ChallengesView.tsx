import React, { useEffect, useState } from 'react';
import {
  Compass,
  Search,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import { api } from '../api';
import { Badge, Button } from './ui';

interface ChallengesViewProps {
  onStartChallenge: (submissionId: string) => void;
  onOpenAuth: () => void;
  user: any;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onStartChallenge, onOpenAuth, user }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [starting, setStarting] = useState(false);

  const categories = [
    'All',
    'Backend',
    'Frontend',
    'Full Stack',
    'Security',
    'System Design',
    'DevOps',
    'Database',
    'AI/ML',
    'Debugging',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Seeded production-grade challenges aligned with the spec
  const curatedChallenges = [
    {
      id: '6ab776c6ef1c989d749010c2',
      title: 'Build a High-Concurrency API',
      difficulty: 'Advanced',
      category: 'Backend',
      technologies: ['Backend', 'PostgreSQL', 'Redis', 'Docker'],
      estimatedHours: '4–6 hours',
      featured: true,
      summary:
        'Architect an ultra-low-latency ticket booking API sustaining 25,000 req/sec flash sales with zero overselling.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'A global ticketing platform opens flash ticket sales for a major world tour. Over 250,000 concurrent fans hit the booking checkout simultaneously within a 15-second window. The relational database cannot handle standard row locking without thread pool exhaustion.',
      mission:
        'Design and implement a resilient ticket inventory decrement pipeline that prevents double-booking, maintains sub-5ms P99 latency, and handles database failovers cleanly.',
      requirements: [
        'Idempotent ticket reservation endpoint under high concurrency',
        'Single-threaded Redis atomic counter or CAS optimistic locking',
        'Two-phase reservation settlement queue with automatic 10-minute expiry',
        'ThreadSanitizer-clean concurrency invariants with zero data races',
      ],
      constraints: [
        'P99 latency must stay under 10ms at 20,000 req/sec load',
        'Zero overselling permitted under any chaos failure injection',
        'Maximum 256MB RAM per container worker instance',
      ],
      evaluation: [
        'Automated container stress suite (24 hidden test scenarios)',
        'Reviewer rubric evaluation across 8 dimensions',
        'Defense round AST cross-examination of failure modes',
      ],
      requiredEvidence: [
        'Interactive Architecture Diagram & component topology',
        'Architecture Decision Record (ADR #03: Redis vs Row Locks)',
        'Container benchmark run logs with latency distribution graphs',
        'Defense question responses explaining load shedding',
      ],
      whatYoullProve: [
        'Distributed state management & high-concurrency synchronization',
        'Deep architectural decision-making and trade-off justification',
        'Production readiness under adversarial load spikes',
      ],
    },
    {
      id: 'c-orderbook-02',
      title: 'Real-Time Order Matching Engine',
      difficulty: 'Advanced',
      category: 'Backend',
      technologies: ['Backend', 'C++', 'Go', 'Redis'],
      estimatedHours: '6–8 hours',
      featured: true,
      summary:
        'Build a FIFO price-time priority limit order book with cache-conscious contiguous data structures.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'A high-frequency exchange needs an in-memory limit order matching engine processing limit and market orders with sub-microsecond latency.',
      mission:
        'Implement an order book using ring buffers and flat contiguous memory layout to avoid heap allocations in the critical matching loop.',
      requirements: [
        'FIFO price-time matching algorithm with cancel/amend capabilities',
        'Zero-allocation matching path in hot loop',
        'Deterministic WAL playback for crash recovery',
      ],
      constraints: ['P99 tick-to-trade latency < 1.5 microseconds', 'Zero memory leaks after 10 million transactions'],
      evaluation: ['Deterministic replay verification against 10M test orders', 'Cache-miss hardware profiling'],
      requiredEvidence: ['ADR on memory layout', 'Benchmark latency telemetry', 'AST defense review'],
      whatYoullProve: ['Mechanical sympathy & low-latency systems engineering', 'Memory alignment & zero-copy protocols'],
    },
    {
      id: 'c-db-wal-03',
      title: 'Crash-Safe Write-Ahead Log (WAL) Engine',
      difficulty: 'Intermediate',
      category: 'Database',
      technologies: ['Database', 'Rust', 'Linux', 'I/O'],
      estimatedHours: '3–5 hours',
      featured: false,
      summary:
        'Construct an append-only log with CRC32 checksums, fsync pacing, and recovery from sudden SIGKILL power cuts.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'An embedded storage engine must persist transactional entries to disk without corrupting state if power is cut midway through an fsync call.',
      mission:
        'Build a chunked append-only log format that detects partial write tearing and recovers to the last consistent checkpoint.',
      requirements: ['CRC32 payload verification', 'Bounded segment compaction', 'ACID commit markers'],
      constraints: ['Zero data corruption under power failure injection', 'Sustained sequential append > 150MB/s'],
      evaluation: ['Chaos kill -9 injection test harness', 'Corrupt byte fuzzing tests'],
      requiredEvidence: ['Architecture spec', 'Crash recovery benchmark', 'ADR on fsync policies'],
      whatYoullProve: ['Storage engine internals & file system semantics', 'Durable transactional fault-tolerance'],
    },
    {
      id: 'c-sec-auth-04',
      title: 'Zero-Trust OAuth2 & Token Vault',
      difficulty: 'Intermediate',
      category: 'Security',
      technologies: ['Security', 'Cryptography', 'JWT', 'TypeScript'],
      estimatedHours: '3–4 hours',
      featured: false,
      summary:
        'Implement cryptographic key rotation, asymmetric token signing (Ed25519), and replay prevention.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'A distributed multi-tenant platform needs microservices to authenticate without sharing symmetric secret keys.',
      mission:
        'Design a token vault utilizing Ed25519 asymmetric pairs with automated JWKS rotation and instant revocation lists.',
      requirements: ['Cryptographic signature verification', 'Non-blocking revocation cache with Bloom filters'],
      constraints: ['Zero plaintext private key exposure', 'Sub-millisecond token introspection'],
      evaluation: ['SAST vulnerability scan', 'Replay attack simulation'],
      requiredEvidence: ['Threat model document', 'Key rotation ADR', 'Security test run'],
      whatYoullProve: ['Applied cryptography and authorization architecture', 'Zero-trust perimeter defense'],
    },
    {
      id: 'c-raft-05',
      title: 'Distributed Consensus with Raft',
      difficulty: 'Advanced',
      category: 'System Design',
      technologies: ['System Design', 'Go', 'Networking', 'gRPC'],
      estimatedHours: '6–8 hours',
      featured: false,
      summary:
        'Build leader election, log replication, and split-brain resolution across a 5-node cluster.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'A distributed configuration service requires consistent state across geographically distributed nodes during network partitions.',
      mission:
        'Implement the core Raft consensus algorithm handling asymmetric partitions, term increments, and log reconciliation.',
      requirements: ['Randomized election timers', 'Log heartbeats & majority quorum agreement', 'Snapshot compaction'],
      constraints: ['Linearizable consistency verified by Jepsen tests', 'Cluster recovery within 300ms of partition healing'],
      evaluation: ['Jepsen chaos partition suite', 'Byzantine failure checks'],
      requiredEvidence: ['State transition diagram', 'ADR on consensus trade-offs', 'Partition test metrics'],
      whatYoullProve: ['Distributed systems consensus', 'Formal fault-tolerance under network partitions'],
    },
    {
      id: 'c-debug-06',
      title: 'Debug a Memory Leak in Production Service',
      difficulty: 'Beginner',
      category: 'Debugging',
      technologies: ['Debugging', 'Node.js', 'V8', 'Chrome DevTools'],
      estimatedHours: '2–3 hours',
      featured: false,
      summary:
        'Analyze heap snapshots and event listener leaks in a high-traffic microservice under load.',
      proofRequired: ['Architecture', 'ADR', 'Tests', 'Deployment'],
      scenario:
        'Every Friday evening after sustained traffic, an API service crashes with JavaScript heap out of memory.',
      mission:
        'Inspect provided memory dumps, locate closure retaining references, patch the leak, and verify with a regression test.',
      requirements: ['Heap diff analysis', 'Root cause postmortem', 'Automated soak test'],
      constraints: ['Flat memory usage graph over 100,000 requests', 'Zero CPU regressions'],
      evaluation: ['Continuous memory profiler suite', 'Postmortem clarity rubric'],
      requiredEvidence: ['Memory heap comparison screenshot', 'Fix PR diff', 'Postmortem explanation'],
      whatYoullProve: ['Production debugging methodologies', 'Runtime internals & garbage collection mechanics'],
    },
  ];

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges();
      if (res.success && res.challenges && res.challenges.length > 0) {
        setChallenges(res.challenges);
      } else {
        setChallenges(curatedChallenges);
      }
    } catch (err) {
      setChallenges(curatedChallenges);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleStart = async (challengeId: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setStarting(true);
    try {
      const res = await api.startChallenge(challengeId);
      if (res.success && res.submission) {
        onStartChallenge(res.submission._id);
      } else {
        onStartChallenge('6ab776c6ef1c989d749010c2');
      }
    } catch (err) {
      onStartChallenge('6ab776c6ef1c989d749010c2');
    } finally {
      setStarting(false);
    }
  };

  // Filter challenges
  const filteredChallenges = curatedChallenges.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      c.summary.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' ||
      c.category.toLowerCase() === activeCategory.toLowerCase() ||
      c.technologies.some((t) => t.toLowerCase() === activeCategory.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === 'All' || c.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
          <Compass size={26} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Find Your Next Challenge
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px', margin: 0, lineHeight: 1.5 }}>
          Real engineering scenarios. No synthetic puzzle trivia. Complete challenges under production constraints, pass containerized test suites, and prove your capabilities.
        </p>
      </div>

      {/* 2. Search & Difficulty Filter Bar */}
      <div
        className="forge-card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 320px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search challenges, technologies or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>

        {/* Difficulty Segmented Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-app)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              style={{
                background: difficultyFilter === diff ? 'var(--bg-surface)' : 'transparent',
                color: difficultyFilter === diff ? 'var(--text-main)' : 'var(--text-secondary)',
                border: difficultyFilter === diff ? '1px solid var(--border-subtle)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: difficultyFilter === diff ? 600 : 500,
                cursor: 'pointer',
                boxShadow: difficultyFilter === diff ? 'var(--shadow-xs)' : 'none',
              }}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activeCategory === cat ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: activeCategory === cat ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Challenge Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredChallenges.map((c) => (
          <div
            key={c.id}
            className="forge-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: c.featured ? '1.5px solid rgba(79, 70, 229, 0.35)' : '1px solid var(--border-subtle)',
              boxShadow: c.featured ? '0 4px 12px rgba(79, 70, 229, 0.08)' : 'var(--shadow-sm)',
              position: 'relative',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {c.featured && (
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  background: 'var(--accent-subtle)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(79, 70, 229, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={11} /> FEATURED
              </div>
            )}

            <div>
              {/* Header: Difficulty & Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: c.difficulty === 'Advanced' ? 'var(--purple-accent)' : c.difficulty === 'Intermediate' ? 'var(--cyan-primary)' : 'var(--emerald-verified)',
                    background: c.difficulty === 'Advanced' ? 'var(--purple-subtle)' : c.difficulty === 'Intermediate' ? 'var(--cyan-subtle)' : 'var(--emerald-subtle)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {c.difficulty}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{c.estimatedHours}</span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {c.title}
              </h3>

              {/* Summary */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {c.summary}
              </p>

              {/* Technologies */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {c.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Proof Required Bar */}
              <div
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Proof Required:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {c.proofRequired.map((proof: string) => (
                    <span
                      key={proof}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <CheckCircle2 size={12} color="var(--emerald-verified)" />
                      {proof}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedChallenge(c)}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
              >
                View Challenge
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleStart(c.id)}
                disabled={starting}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
              >
                <span>Start</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          5. CHALLENGE DETAIL MODAL / PAGE (Section 14)
          Scenario, Mission, Requirements, Constraints, Evaluation, Required Evidence, What You'll Prove
          ========================================================================= */}
      {selectedChallenge && (
        <div className="modal-backdrop" onClick={() => setSelectedChallenge(null)} style={{ zIndex: 1100 }}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
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
                    {selectedChallenge.difficulty}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    ⏱ {selectedChallenge.estimatedHours}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {selectedChallenge.technologies.join(' · ')}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {selectedChallenge.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedChallenge(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.25rem' }}>
              {/* 1. The Scenario */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
                  The Scenario
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {selectedChallenge.scenario}
                </p>
              </div>

              {/* 2. Your Mission */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan-primary)', marginBottom: '0.35rem' }}>
                  Your Mission
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
                  {selectedChallenge.mission}
                </p>
              </div>

              {/* 3. Requirements */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Requirements
                </h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedChallenge.requirements?.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Constraints */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--amber-warning)', marginBottom: '0.5rem' }}>
                  Constraints
                </h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedChallenge.constraints?.map((con: string, i: number) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>

              {/* 5. Evaluation */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--purple-accent)', marginBottom: '0.5rem' }}>
                  Evaluation
                </h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedChallenge.evaluation?.map((ev: string, i: number) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* 6. Required Evidence */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--emerald-verified)', marginBottom: '0.5rem' }}>
                  Required Evidence
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {selectedChallenge.requiredEvidence?.map((ev: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.625rem 0.75rem',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-main)',
                      }}
                    >
                      <CheckCircle2 size={15} color="var(--emerald-verified)" style={{ flexShrink: 0 }} />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. What You'll Prove */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  What You'll Prove
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedChallenge.whatYoullProve?.map((w: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--accent-subtle)',
                        border: '1px solid rgba(79, 70, 229, 0.25)',
                        color: 'var(--accent-primary)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                      }}
                    >
                      ✓ {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <button className="btn btn-secondary" onClick={() => setSelectedChallenge(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const id = selectedChallenge.id;
                  setSelectedChallenge(null);
                  handleStart(id);
                }}
                disabled={starting}
                style={{ padding: '0.625rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600 }}
              >
                <span>Start Challenge</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
