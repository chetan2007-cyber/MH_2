import React from 'react';
import { HelpCircle } from 'lucide-react';
import { nodeColorMap } from './GraphLegend';

interface GraphCanvasProps {
  nodes: any[];
  edges: any[];
  selectedNode: any | null;
  onSelectNode: (node: any) => void;
  onOpenWhyModal: (node: any) => void;
  loading: boolean;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  onOpenWhyModal,
  loading,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        Generating topological ProofGraph...
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        No verified evidence nodes found for this candidate yet.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minWidth: '950px', minHeight: '580px' }}>
      {/* SVG Curved Connections */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {edges.map((edge) => {
          const srcNode = nodes.find((n) => n.id === edge.source);
          const tgtNode = nodes.find((n) => n.id === edge.target);
          if (!srcNode || !tgtNode) return null;

          const x1 = srcNode.x + 90;
          const y1 = srcNode.y + 25;
          const x2 = tgtNode.x + 90;
          const y2 = tgtNode.y + 25;
          const midX = (x1 + x2) / 2;

          return (
            <g key={edge.id}>
              <path
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="url(#edgeGrad)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Topological Nodes */}
      {nodes.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const color = nodeColorMap[node.type]?.color || 'var(--cyan-primary)';

        return (
          <div
            key={node.id}
            onClick={() => onSelectNode(node)}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              zIndex: 2,
              width: '180px',
              backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
              border: `1.5px solid ${isSelected ? color : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.625rem 0.75rem',
              cursor: 'pointer',
              boxShadow: isSelected ? `0 4px 14px ${color}35` : 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {node.type.replace('_', ' ')}
              </span>
              {node.score && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(2, 132, 199, 0.1)',
                    color: 'var(--cyan-primary)',
                  }}
                >
                  {node.score}
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {node.label}
            </div>

            {node.type === 'CAPABILITY_ROOT' && (
              <button
                className="btn btn-secondary btn-sm"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.4rem',
                  color: 'var(--cyan-primary)',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenWhyModal(node);
                }}
              >
                <HelpCircle size={12} /> Why {node.score}?
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
