import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCode,
  Terminal,
  Layers,
  HelpCircle,
  Cpu,
  GitBranch,
  Code,
  AlertTriangle,
  Send,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../../../api';
import { Badge, Button } from '../../../components/ui';

export const ReviewDesk: React.FC = () => {
  const [inReviewMode, setInReviewMode] = useState(false);
  const [activeNav, setActiveNav] = useState<'overview' | 'repository' | 'architecture' | 'adr' | 'tests' | 'evidence' | 'defense'>('overview');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Submissions list matching Section 20
  const queueSubmissions = [
    {
      id: '6ab776c6ef1c989d749010c2',
      title: 'High-Concurrency API',
      candidateName: 'Rahul Sharma',
      difficulty: 'Advanced',
      domain: 'Backend',
      automatedVerification: 'Passed',
      reviewStatus: 'Pending',
      submittedAt: 'Today · 10:14 AM',
      summary: 'Prevent overselling under 25,000 req/sec flash sales. Single-threaded Redis atomic decrements.',
    },
    {
      id: 'sub-orderbook-02',
      title: 'Real-Time Order Matching Engine',
      candidateName: 'Priya Patel',
      difficulty: 'Advanced',
      domain: 'Low-Latency',
      automatedVerification: 'Passed',
      reviewStatus: 'Pending',
      submittedAt: 'Yesterday',
      summary: 'Continuous FIFO price-time priority limit order book with flat contiguous memory layout.',
    },
  ];

  // 8 Rubric dimensions matching Section 21
  const [rubricScores, setRubricScores] = useState<Record<string, { score: number; comment: string; evidence: string; confidence: string }>>({
    correctness: {
      score: 9,
      comment: 'Lock-free atomic CAS decrements successfully eliminate race conditions.',
      evidence: 'src/concurrency/cas_lock.go#L45-L82',
      confidence: 'High',
    },
    architecture: {
      score: 9,
      comment: 'Clean boundary between synchronous in-memory reservations and async DB settlement.',
      evidence: 'Architecture topology blueprint & WAL buffer specification',
      confidence: 'High',
    },
    codeQuality: {
      score: 8,
      comment: 'Idiomatic Go with clean error propagation and zero unhandled goroutine panics.',
      evidence: 'src/services/booking.go#L60-L115',
      confidence: 'High',
    },
    testing: {
      score: 9,
      comment: 'Comprehensive chaos race condition suite verifying 50,000 concurrent threads.',
      evidence: 'test/chaos_race_test.go#L110',
      confidence: 'High',
    },
    security: {
      score: 8,
      comment: 'Strict token verification at gateway edge and parameterized SQL statements.',
      evidence: 'src/middleware/auth.go#L22',
      confidence: 'Medium',
    },
    performance: {
      score: 9,
      comment: 'Sustained 22,400 req/sec with P99 response latency of 2.3ms in gVisor sandbox.',
      evidence: 'gVisor stress benchmark run telemetry #88',
      confidence: 'High',
    },
    engineeringReasoning: {
      score: 9,
      comment: 'Clear, documented rationale rejecting PostgreSQL row locks and Redis Redlock.',
      evidence: 'ADR-03: Use Redis for distributed rate limiting',
      confidence: 'High',
    },
    maintainability: {
      score: 8,
      comment: 'Clear interface boundaries and descriptive domain model structs.',
      evidence: 'src/domain/ticket.go#L15',
      confidence: 'High',
    },
  });

  const rubricLabels: Record<string, string> = {
    correctness: 'Correctness',
    architecture: 'Architecture',
    codeQuality: 'Code Quality',
    testing: 'Testing',
    security: 'Security',
    performance: 'Performance',
    engineeringReasoning: 'Engineering Reasoning',
    maintainability: 'Maintainability',
  };

  const handleScoreChange = (dim: string, score: number) => {
    setRubricScores((prev) => ({
      ...prev,
      [dim]: { ...prev[dim], score },
    }));
  };

  const handleCommentChange = (dim: string, comment: string) => {
    setRubricScores((prev) => ({
      ...prev,
      [dim]: { ...prev[dim], comment },
    }));
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setMessage({ type: 'success', text: 'Calibrated review successfully submitted! ProofGraph updated.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Error submitting review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* =========================================================================
          VIEW 1: REVIEW QUEUE (Section 20)
          ========================================================================= */}
      {!inReviewMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Review Queue
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem', margin: 0 }}>
              Evaluate engineering work. Strengthen the signal.
            </p>
          </div>

          {/* Submissions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {queueSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="forge-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--purple-accent)',
                        background: 'var(--purple-subtle)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {sub.difficulty}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {sub.domain}
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Submitted {sub.submittedAt}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {sub.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Candidate: <strong style={{ color: 'var(--text-main)' }}>{sub.candidateName}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Automated verification:</span>
                      <span style={{ color: 'var(--emerald-verified)', fontWeight: 700 }}>
                        ● {sub.automatedVerification}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Review:</span>
                      <span style={{ color: 'var(--amber-warning)', fontWeight: 700 }}>
                        ● {sub.reviewStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setInReviewMode(true)}
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <span>Start Review</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 2: REVIEW WORKSPACE (Section 21 - Professional 3-Column Interface)
           LEFT: Submission navigation
           CENTER: Evidence
           RIGHT: Rubric (Correctness, Architecture, Code Quality, Testing, Security, Performance, Engineering Reasoning, Maintainability)
           ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Bar for Review Workspace */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setInReviewMode(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ArrowLeft size={15} />
                <span>Back to Queue</span>
              </button>
              <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  High-Concurrency API
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                  Candidate: Rahul Sharma
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Badge variant="emerald">AUTOMATED CHECKS: PASSED</Badge>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitReview}
                isLoading={submitting}
                leftIcon={<Send size={14} />}
              >
                Submit Calibrated Review
              </Button>
            </div>
          </div>

          {message && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: message.type === 'success' ? 'var(--emerald-subtle)' : 'var(--rose-subtle)', color: message.type === 'success' ? 'var(--emerald-verified)' : 'var(--rose-error)', border: `1px solid ${message.type === 'success' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(225, 29, 72, 0.25)'}`, fontSize: '0.875rem', fontWeight: 600 }}>
              {message.text}
            </div>
          )}

          {/* 3-Column Layout Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '220px minmax(400px, 1fr) 380px',
              gap: '1.25rem',
              alignItems: 'start',
            }}
          >
            {/* LEFT: Submission Navigation (Section 21) */}
            <aside
              className="forge-card"
              style={{
                padding: '1.25rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ padding: '0 0.5rem 0.5rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Submission Navigation
              </div>

              {[
                { id: 'overview', label: 'Overview', icon: <Eye size={14} /> },
                { id: 'repository', label: 'Repository', icon: <GitBranch size={14} /> },
                { id: 'architecture', label: 'Architecture', icon: <Layers size={14} /> },
                { id: 'adr', label: 'ADR', icon: <FileCode size={14} /> },
                { id: 'tests', label: 'Tests', icon: <Terminal size={14} /> },
                { id: 'evidence', label: 'Evidence', icon: <ShieldCheck size={14} /> },
                { id: 'defense', label: 'Defense', icon: <HelpCircle size={14} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: activeNav === item.id ? 'var(--accent-subtle)' : 'transparent',
                    color: activeNav === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: activeNav === item.id ? 700 : 500,
                    fontSize: '0.8125rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            {/* CENTER: Evidence Display (Section 21) */}
            <div className="forge-card" style={{ padding: '1.5rem', minHeight: '520px' }}>
              {activeNav === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Submission Overview
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    High-Concurrency Ticket Booking API candidate implementation by Rahul Sharma. Implements lock-free atomic decrements with Redis Lua scripts and asynchronous WAL persistence into PostgreSQL.
                  </p>
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                    <div>Throughput: <strong>22,400 req/sec</strong></div>
                    <div>P99 Latency: <strong>2.3ms</strong></div>
                    <div>Hidden Tests: <strong>24/24 Passed</strong></div>
                    <div>Data Races: <strong>0 (TSan verified)</strong></div>
                  </div>
                </div>
              )}

              {activeNav === 'repository' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Repository & Git Provenance
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                    repo: github.com/rahul-sharma/concurrency-ticket-engine<br />
                    commit: e9a4f21d8b76c5432a90184b2efc89d7
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    All 18 commits verified with clean signed author keys and linear history.
                  </div>
                </div>
              )}

              {activeNav === 'architecture' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Architecture Boundary Evidence
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Client → Edge Gateway (Redis Lua Rate Limiting) → Worker Pool → Redis Memory CAS → Asynchronous WAL Worker → PostgreSQL Partitioned Ledger.
                  </p>
                </div>
              )}

              {activeNav === 'adr' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    ADR-03: Use Redis for distributed rate limiting
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Candidate rejected PostgreSQL row locks and in-memory local buckets. Adopted Redis cluster Lua sliding window counter to enforce uniform rate limits across all gateway instances.
                  </p>
                </div>
              )}

              {activeNav === 'tests' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Container Benchmark Telemetry
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Executed 24 hermetic test scenarios under gVisor isolation. 25,000 requests per second sustained with zero double bookings.
                  </p>
                </div>
              )}

              {activeNav === 'evidence' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Evidence Ledger & Cryptographic Anchors
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    All test outputs, latency distributions, and commit trees are cryptographically hashed and anchored into the candidate's ProofGraph™.
                  </p>
                </div>
              )}

              {activeNav === 'defense' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Defense Round™ Cross-Examination
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Interrogated failure modes when Redis sentinel encounters failover delays. Candidate demonstrated deep understanding of fail-open strategies for VIP traffic.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: Rubric (Section 21: Correctness, Architecture, Code Quality, Testing, Security, Performance, Engineering Reasoning, Maintainability) */}
            <aside
              className="forge-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxHeight: '680px',
                overflowY: 'auto',
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  8-Dimension Calibrated Rubric
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Provide Score (1–10), Comment, Evidence Citation, and Confidence.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(rubricScores).map(([key, item]) => (
                  <div
                    key={key}
                    style={{
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {rubricLabels[key] || key}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score:</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={item.score}
                          onChange={(e) => handleScoreChange(key, parseInt(e.target.value) || 0)}
                          style={{
                            width: '44px',
                            textAlign: 'center',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--accent-primary)',
                            padding: '0.2rem',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Reviewer comment / critique..."
                      value={item.comment}
                      onChange={(e) => handleCommentChange(key, e.target.value)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.5rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>Evidence: {item.evidence}</span>
                      <span style={{ fontWeight: 600, color: 'var(--emerald-verified)' }}>● {item.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};
