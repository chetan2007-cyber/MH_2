import React from 'react';
import { Badge } from '../../../components/ui';

export const nodeColorMap: Record<string, { color: string; label: string }> = {
  CAPABILITY_ROOT: { color: 'var(--cyan-primary)', label: 'Capabilities' },
  CHALLENGE: { color: '#3b82f6', label: 'Challenges' },
  PROJECT: { color: '#a855f7', label: 'Projects' },
  AUTOMATED_TESTS: { color: 'var(--emerald-verified)', label: 'Sandbox Tests' },
  ADR: { color: 'var(--amber-warning)', label: 'ADRs' },
  EXPERT_REVIEW: { color: '#0d9488', label: 'Peer Reviews' },
  DEFENSE_ROUND: { color: '#6366f1', label: 'AST Defense' },
};

interface GraphLegendProps {
  nodeCount: number;
  edgeCount: number;
}

export const GraphLegend: React.FC<GraphLegendProps> = ({ nodeCount, edgeCount }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          EVIDENCE TOPOLOGY:
        </span>
        {Object.entries(nodeColorMap).map(([type, { color, label }]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Badge variant="cyan">{nodeCount} Verified Nodes</Badge>
        <Badge variant="emerald">{edgeCount} Evidence Edges</Badge>
      </div>
    </div>
  );
};
