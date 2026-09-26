import React, { useEffect, useState } from 'react';
import {
  Search,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  ShieldCheck,
  FileCode,
  Activity,
  History,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../../api';
import { CapabilityFilters } from './CapabilityFilters';
import { CandidateCard } from './CandidateCard';
import { OpportunityModal } from './OpportunityModal';
import { Badge, Button } from '../../../components/ui';

export interface RecruiterDiscoverProps {
  onOpenProofGraph: (candidateId: string) => void;
  user: any;
}

export const RecruiterDiscover: React.FC<RecruiterDiscoverProps> = ({ onOpenProofGraph }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters State (Section 23)
  const [search, setSearch] = useState('');
  const [capabilityFilter, setCapabilityFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Candidate Detail View State (Section 24)
  const [detailedCandidate, setDetailedCandidate] = useState<any | null>(null);

  // Opportunity Modal State (Section 25)
  const [opportunityCandidate, setOpportunityCandidate] = useState<any | null>(null);
  const [sendingOpp, setSendingOpp] = useState(false);
  const [oppSuccess, setOppSuccess] = useState<string | null>(null);

  // Recommended Engineers Seed (Section 22)
  const recommendedEngineers = [
    {
      candidateId: 'cand-rahul',
      name: 'Rahul Sharma',
      headline: 'Backend Engineer',
      backendScore: 87,
      systemDesignScore: 82,
      testingScore: 91,
      databaseScore: 79,
      securityScore: 68,
      verifiedProjectsCount: 6,
      expertReviewsCount: 8,
      adrsCount: 14,
      proofConfidence: 'High',
      skills: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Distributed Systems'],
      verifiedProjects: [
        {
          title: 'High-Concurrency Ticket Booking API',
          tier: 'Advanced',
          p99: '2.3ms',
          tests: '24/24',
          adrs: 4,
          summary: 'Single-threaded Redis atomic decrements with PostgreSQL partitioned ledger.',
        },
        {
          title: 'Real-Time Order Matching Engine',
          tier: 'Advanced',
          p99: '0.8ms',
          tests: '26/26',
          adrs: 3,
          summary: 'FIFO price-time priority limit order book with flat contiguous memory layout.',
        },
        {
          title: 'Distributed Consensus with Raft',
          tier: 'Advanced',
          p99: '3.4ms',
          tests: '30/30',
          adrs: 2,
          summary: '5-node Raft implementation surviving asymmetric network partitions.',
        },
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
      adrs: [
        { id: 'ADR-01', title: 'Redis Atomic Decrement vs Row Locks', decision: 'Atomic Compare-And-Swap (CAS)' },
        { id: 'ADR-02', title: 'Exponential Backoff Retry Strategy', decision: 'Full jitter client retry loop' },
        { id: 'ADR-03', title: 'Use Redis for distributed rate limiting', decision: 'Lua sliding window counter' },
      ],
      improvementHistory: [
        { date: '1 month ago', event: 'Initial Foundation Challenge completed (Score: 72)' },
        { date: '3 weeks ago', event: 'Refactored locking strategy to lock-free CAS (Score: 81)' },
        { date: '1 week ago', event: 'Passed gVisor 25k RPS stress harness under 2.3ms P99 (Score: 87)' },
      ],
    },
    {
      candidateId: 'cand-priya',
      name: 'Priya Patel',
      headline: 'Low-Latency & Systems Engineer',
      backendScore: 92,
      systemDesignScore: 89,
      testingScore: 88,
      databaseScore: 84,
      securityScore: 75,
      verifiedProjectsCount: 5,
      expertReviewsCount: 7,
      adrsCount: 11,
      proofConfidence: 'High',
      skills: ['C++', 'Rust', 'Linux Internals', 'SIMD'],
    },
    {
      candidateId: 'cand-marcus',
      name: 'Marcus Chen',
      headline: 'Full Stack & Database Engineer',
      backendScore: 84,
      systemDesignScore: 86,
      testingScore: 89,
      databaseScore: 91,
      securityScore: 80,
      verifiedProjectsCount: 7,
      expertReviewsCount: 9,
      adrsCount: 16,
      proofConfidence: 'High',
      skills: ['PostgreSQL', 'TypeScript', 'WAL Internals', 'Docker'],
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSendOpportunity = async (data: any) => {
    setSendingOpp(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setOppSuccess(`Opportunity sent directly to ${opportunityCandidate.name}'s dashboard!`);
      setTimeout(() => {
        setOpportunityCandidate(null);
        setOppSuccess(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingOpp(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* =========================================================================
          VIEW 1: RECRUITER CANDIDATE VIEW (Section 24)
          Not a resume page: Header, Capabilities, ProofGraph, Projects, Reviews, ADRs, History, Create Opportunity CTA
          ========================================================================= */}
      {detailedCandidate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Back button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setDetailedCandidate(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={15} />
              <span>Back to Candidate Search</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setOpportunityCandidate(detailedCandidate)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem' }}
            >
              <Send size={15} />
              <span>Create Opportunity</span>
            </button>
          </div>

          {/* Candidate Header */}
          <div className="forge-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {detailedCandidate.name}
                </h1>
                <CheckCircle2 size={18} color="var(--emerald-verified)" />
                <Badge variant="emerald">HIGH PROOF CONFIDENCE</Badge>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
                {detailedCandidate.headline}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => onOpenProofGraph(detailedCandidate.candidateId)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Layers size={15} color="var(--accent-primary)" />
                <span>Open in ProofGraph™</span>
              </button>
            </div>
          </div>

          {/* 1. Engineering Capability Section */}
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Engineering Capability Vectors
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Backend', score: detailedCandidate.backendScore },
                { name: 'System Design', score: detailedCandidate.systemDesignScore },
                { name: 'Testing', score: detailedCandidate.testingScore },
              ].map((c) => (
                <div key={c.name} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{c.name}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', margin: '0.25rem 0' }}>
                    {c.score}
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ height: '100%', width: `${c.score}%`, background: 'var(--accent-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Verified Projects Section */}
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Verified Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {detailedCandidate.verifiedProjects?.map((p: any, idx: number) => (
                <div key={idx} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{p.title}</span>
                    <Badge variant="purple">{p.tier}</Badge>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{p.summary}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>P99: <strong style={{ color: 'var(--emerald-verified)' }}>{p.p99}</strong></span>
                    <span>Hidden Tests: <strong style={{ color: 'var(--text-main)' }}>{p.tests}</strong></span>
                    <span>Accepted ADRs: <strong style={{ color: 'var(--accent-primary)' }}>{p.adrs}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Double-Blind Reviews Section */}
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Calibrated Peer Reviews
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {detailedCandidate.reviews?.map((r: any, idx: number) => (
                <div key={idx} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.reviewer}</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{r.score}</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{r.role}</div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Architecture Decisions */}
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Architecture Decisions (ADRs)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {detailedCandidate.adrs?.map((adr: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {adr.id}: {adr.title}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Decision: {adr.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Improvement History */}
          <div className="forge-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Improvement History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailedCandidate.improvementHistory?.map((h: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: '100px' }}>{h.date}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{h.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setOpportunityCandidate(detailedCandidate)}
              style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <span>Create Opportunity</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 2: RECRUITER SEARCH & RECOMMENDED ENGINEERS (Section 22 & 23)
           ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Find engineering capability.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem', margin: 0 }}>
              Search engineers by proven capability scores, stress benchmarks, and accepted architectural decisions.
            </p>
          </div>

          {/* Search & Comprehensive Filters */}
          <CapabilityFilters
            capabilityFilter={capabilityFilter}
            setCapabilityFilter={setCapabilityFilter}
            techFilter={techFilter}
            setTechFilter={setTechFilter}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            verificationFilter={verificationFilter}
            setVerificationFilter={setVerificationFilter}
            confidenceFilter={confidenceFilter}
            setConfidenceFilter={setConfidenceFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
            search={search}
            setSearch={setSearch}
            onSearch={handleSearchSubmit}
          />

          {/* Recommended Engineers Section (Section 22) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Recommended Engineers
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Sorted by Verified Evidence Density
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {recommendedEngineers.map((cand) => (
                <CandidateCard
                  key={cand.candidateId}
                  candidate={cand}
                  onOpenProofGraph={onOpenProofGraph}
                  onSelectForOpportunity={(c) => setOpportunityCandidate(c)}
                  onViewCandidateDetails={(c) => setDetailedCandidate(c)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Modal (Section 25) */}
      {opportunityCandidate && (
        <OpportunityModal
          candidate={opportunityCandidate}
          onClose={() => setOpportunityCandidate(null)}
          onSend={handleSendOpportunity}
          sending={sendingOpp}
          successMsg={oppSuccess}
        />
      )}
    </div>
  );
};
