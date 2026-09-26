import React, { useEffect, useState } from 'react';
import { Layers, ShieldCheck, Cpu, FileCode, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../../api';
import { GraphLegend } from './GraphLegend';
import { GraphCanvas } from './GraphCanvas';
import { EvidenceDrawer } from './EvidenceDrawer';
import { WhyScoreModal } from '../../candidate/components/WhyScoreModal';
import { Badge, Button } from '../../../components/ui';

export interface ProofGraphViewProps {
  candidateId?: string;
  onNavigate?: (view: string) => void;
}

export const ProofGraphView: React.FC<ProofGraphViewProps> = ({ candidateId, onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [whyModalData, setWhyModalData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Canonical Section 18 Topology
  const canonicalGraph = {
    nodes: [
      // Central Node
      {
        id: 'central-backend',
        label: 'Backend Engineering — 87',
        type: 'CAPABILITY_ROOT',
        score: 87,
        confidence: 'HIGH',
        x: 400,
        y: 40,
        explanation: {
          summaryPoints: [
            'Composite derived from 4 verified distributed systems projects',
            'Sub-3ms P99 latency verified in hermetic gVisor container suite',
            '14 accepted Architecture Decision Records with rejected alternatives',
            '8 double-blind expert audits with average score of 8.8/10',
          ],
        },
      },
      // Level 2: Connected Projects
      {
        id: 'proj-high-concurrency',
        label: 'High-Concurrency API',
        type: 'PROJECT',
        x: 100,
        y: 180,
        tech: 'Go · Redis · PostgreSQL',
        domain: 'Distributed Systems',
      },
      {
        id: 'proj-payment-service',
        label: 'Payment Service',
        type: 'PROJECT',
        x: 400,
        y: 180,
        tech: 'Node.js · PostgreSQL · Kafka',
        domain: 'Financial Infrastructure',
      },
      {
        id: 'proj-debugging',
        label: 'Debugging Challenge',
        type: 'PROJECT',
        x: 700,
        y: 180,
        tech: 'V8 · Node.js · Profiling',
        domain: 'Memory & Performance',
      },
      // Level 3: Evidence Nodes for High-Concurrency API
      {
        id: 'ev-code',
        label: 'Code: cas_lock.go',
        type: 'CODE_COMMIT',
        x: 40,
        y: 340,
        sha: 'e9a4f21d8b76c543',
        repo: 'rahul-sharma/concurrency-ticket-engine',
      },
      {
        id: 'ev-tests',
        label: 'Tests: 24/24 Passed',
        type: 'AUTOMATED_TESTS',
        x: 220,
        y: 340,
        passRate: 100,
        p99LatencyMs: 2.3,
        throughputRps: 22400,
        logs: [
          { timestamp: '10:14:02.102', message: 'gVisor sandbox initialized (isolate: hermetic-v8)' },
          { timestamp: '10:14:04.450', message: 'Stress suite: 25,000 req/sec sustained across 12 threads' },
          { timestamp: '10:14:06.890', message: 'Race check (ThreadSanitizer): 0 data races detected' },
          { timestamp: '10:14:07.120', message: 'P99 Latency: 2.34ms · Zero double-bookings verified' },
        ],
      },
      {
        id: 'ev-arch',
        label: 'Architecture Diagram',
        type: 'ARCHITECTURE',
        x: 400,
        y: 340,
        summary: 'Atomic Redis CAS with asynchronous WAL persistence into PostgreSQL partitioned ledger.',
      },
      {
        id: 'ev-adr',
        label: 'ADR-03: Rate Limiting',
        type: 'ADR',
        x: 580,
        y: 340,
        adrId: 'ADR-03',
        title: 'Use Redis for distributed rate limiting',
        status: 'Verified',
        reviewer: 'Senior Backend Reviewer',
        decision: 'Adopt Redis sliding window counter via Lua script across gateway replicas.',
        tradeOffs: 'Operational dependency on Redis cluster; fail open for VIP traffic.',
        evidenceCitation: 'src/middleware/rate_limiter.go#L34-L88',
        adrsList: [
          {
            title: 'ADR-03: Use Redis for distributed rate limiting',
            decision: 'Adopt Redis sliding window counter via Lua script across gateway replicas.',
            tradeOffs: 'Network hop to Redis cache layer; bounded operational dependency.',
          },
        ],
      },
      {
        id: 'ev-review',
        label: 'Review: 8.8 / 10',
        type: 'PEER_REVIEW',
        x: 760,
        y: 340,
        reviewer: 'Senior Backend Reviewer',
        score: '8.8 / 10',
        rriScore: 1.45,
        rubricItem: 'Correctness & Architectural Reasoning',
        comment: 'Clean concurrency isolation with lock-free atomic decrements. Zero LeetCode trivia.',
      },
      {
        id: 'ev-defense',
        label: 'Defense Round™ AST',
        type: 'DEFENSE_ROUND',
        x: 940,
        y: 340,
        status: 'VERIFIED',
        confidence: '99.4% AST Match',
        verdict: 'Genuine technical authorship certified through live failure-mode interrogation.',
      },
    ],
    edges: [
      // Central to 3 Projects
      { id: 'e1', source: 'central-backend', target: 'proj-high-concurrency' },
      { id: 'e2', source: 'central-backend', target: 'proj-payment-service' },
      { id: 'e3', source: 'central-backend', target: 'proj-debugging' },
      // Project to Evidence Nodes
      { id: 'e4', source: 'proj-high-concurrency', target: 'ev-code' },
      { id: 'e5', source: 'proj-high-concurrency', target: 'ev-tests' },
      { id: 'e6', source: 'proj-high-concurrency', target: 'ev-arch' },
      { id: 'e7', source: 'proj-high-concurrency', target: 'ev-adr' },
      { id: 'e8', source: 'proj-high-concurrency', target: 'ev-review' },
      { id: 'e9', source: 'proj-high-concurrency', target: 'ev-defense' },
    ],
  };

  const [graphData, setGraphData] = useState(canonicalGraph);

  useEffect(() => {
    setSelectedNode(canonicalGraph.nodes.find((n) => n.id === 'ev-adr') || canonicalGraph.nodes[0]);
  }, [candidateId]);

  const handleOpenWhyModal = (capNode: any) => {
    setWhyModalData({
      dimension: capNode.label,
      score: capNode.score || 87,
      explanation: capNode.explanation,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Badge variant="cyan">TOPOLOGICAL DAG</Badge>
            <Badge variant="emerald">CRYPTOGRAPHICALLY VERIFIED</Badge>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Your ProofGraph
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem', margin: 0 }}>
            Interactive evidence mesh linking high-level engineering capabilities directly down to verified code, benchmarks, ADRs, and peer audits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <Button variant="secondary" size="sm" onClick={() => onNavigate && onNavigate('passport')}>
            View Proof Passport™
          </Button>
        </div>
      </div>

      {/* 2. Legend Bar */}
      <GraphLegend nodeCount={graphData.nodes.length} edgeCount={graphData.edges.length} />

      {/* 3. Main Grid: Interactive Canvas on Left, Evidence Inspector Panel on Right (Section 18) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 1fr) 380px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Interactive Topology Canvas */}
        <div
          className="forge-card"
          style={{
            minHeight: '620px',
            background: 'radial-gradient(#cbd5e1 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            padding: '1rem',
            overflow: 'auto',
          }}
        >
          <GraphCanvas
            nodes={graphData.nodes}
            edges={graphData.edges}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onOpenWhyModal={handleOpenWhyModal}
            loading={loading}
          />
        </div>

        {/* Right-Side Evidence Panel (Section 18 Specification) */}
        <div>
          <EvidenceDrawer
            selectedNode={selectedNode}
            onOpenWhyModal={handleOpenWhyModal}
          />
        </div>
      </div>

      {/* Why Score Modal */}
      {whyModalData && (
        <WhyScoreModal data={whyModalData} onClose={() => setWhyModalData(null)} />
      )}
    </div>
  );
};
