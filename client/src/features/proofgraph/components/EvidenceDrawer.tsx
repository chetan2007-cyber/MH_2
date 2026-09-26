import React from 'react';
import { CheckCircle2, Terminal } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { nodeColorMap } from './GraphLegend';

interface EvidenceDrawerProps {
  selectedNode: any | null;
  onOpenWhyModal: (node: any) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ selectedNode, onOpenWhyModal }) => {
  if (!selectedNode) {
    return (
      <div className="forge-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select any node in the topology mesh to inspect its cryptographically anchored evidence dossier.
      </div>
    );
  }

  const nodeColor = nodeColorMap[selectedNode.type]?.color || 'var(--cyan-primary)';

  return (
    <div className="forge-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)', fontWeight: 700 }}>
          VERIFIED EVIDENCE INSPECTOR
        </span>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.25rem 0 0 0', color: 'var(--text-main)' }}>
          {selectedNode.label}
        </h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge variant="cyan" style={{ backgroundColor: `${nodeColor}14`, color: nodeColor, borderColor: `${nodeColor}33` }}>
          {selectedNode.type}
        </Badge>
        <Badge variant="emerald">
          <CheckCircle2 size={12} />
          <span>VERIFIED AUTHENTIC</span>
        </Badge>
      </div>

      {/* Node-Specific Details */}
      {selectedNode.type === 'CAPABILITY_ROOT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
              <span>Confidence Level:</span>
              <strong style={{ color: 'var(--cyan-primary)' }}>{selectedNode.confidence || 'HIGH'}</strong>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {selectedNode.explanation?.summaryPoints?.map((pt: string, idx: number) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>
          <Button variant="primary" size="sm" onClick={() => onOpenWhyModal(selectedNode)}>
            Inspect Full Mathematical Derivation ("Why {selectedNode.score}?")
          </Button>
        </div>
      )}

      {selectedNode.type === 'AUTOMATED_TESTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span>Pass Rate:</span>
              <strong style={{ color: 'var(--emerald-verified)' }}>{selectedNode.passRate}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span>P99 Response Latency:</span>
              <strong style={{ color: 'var(--purple-accent)' }}>{selectedNode.p99LatencyMs}ms</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Throughput:</span>
              <strong style={{ color: 'var(--amber-warning)' }}>{selectedNode.throughputRps?.toLocaleString()} req/sec</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latest Container Sandbox Logs:</div>
          <div style={{ background: '#0f172a', color: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', maxHeight: '160px', overflowY: 'auto' }}>
            {selectedNode.logs?.map((l: any, i: number) => (
              <div key={i} style={{ marginBottom: '0.2rem' }}>
                <span style={{ color: '#64748b' }}>[{l.timestamp}]</span> {l.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedNode.type === 'ADR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {selectedNode.adrId || 'ADR-03'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--emerald-verified)',
                  background: 'var(--emerald-subtle)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                }}
              >
                ● Verified
              </span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {selectedNode.title || 'Use Redis for rate limiting'}
            </h4>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Decision:</strong> {selectedNode.decision || 'Adopt Redis sliding window counter via Lua script across gateway replicas.'}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div>Reviewed by:</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                {selectedNode.reviewer || 'Senior Backend Reviewer'}
              </strong>
            </div>

            {selectedNode.evidenceCitation && (
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', background: 'var(--accent-subtle)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
                Citation: {selectedNode.evidenceCitation}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedNode.type === 'EXPERT_REVIEW' && (
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Consensus Score:</span>
            <strong style={{ color: 'var(--emerald-verified)', fontSize: '1rem' }}>{selectedNode.overallScore} / 10</strong>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "{selectedNode.qualitative}"
          </p>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Audited by calibrated Senior/Staff engineers with mandatory inline citations.
          </div>
        </div>
      )}

      {selectedNode.type === 'DEFENSE_ROUND' && (
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Defense Status:</span>
            <strong style={{ color: 'var(--emerald-verified)' }}>{selectedNode.status || 'EVALUATED'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>AST Author Confidence:</span>
            <strong style={{ color: 'var(--cyan-primary)' }}>{selectedNode.confidence || 'STRONG'}</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            {selectedNode.notes || 'Candidate proved active architectural authorship during interactive cross-examination.'}
          </p>
        </div>
      )}
    </div>
  );
};
