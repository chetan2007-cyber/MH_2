import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, FileText, GitCommit, Shield, Cpu, ChevronRight, Info,
  Palette, Activity, Layers, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useProofGraph } from '../../hooks/useProofGraph';
import type { ProofGraphNode } from '../../types/api';

const NODE_TYPE_CONFIG: Record<string, { icon: React.FC<{size?: number; color?: string}>, bg: string, border: string }> = {
  CAPABILITY: { icon: Cpu, bg: 'rgba(79,70,229,0.15)', border: '#4f46e5' },
  PROJECT: { icon: GitCommit, bg: 'rgba(2,132,199,0.12)', border: '#0284c7' },
  ADR: { icon: FileText, bg: 'rgba(124,58,237,0.12)', border: '#7c3aed' },
  REVIEW: { icon: CheckCircle2, bg: 'rgba(5,150,105,0.12)', border: '#059669' },
  TEST: { icon: Shield, bg: 'rgba(16,185,129,0.1)', border: '#10b981' },
  DEFENSE: { icon: Shield, bg: 'rgba(217,119,6,0.12)', border: '#d97706' },
};

const NODE_RADIUS: Record<string, number> = {
  CAPABILITY: 40, PROJECT: 32, ADR: 26, REVIEW: 26, TEST: 24, DEFENSE: 26
};

export const CandidateProofGraph: React.FC = () => {
  const { selectedProfession, selectedDomain } = useCareer();
  const { graphData, loading, error, refetch } = useProofGraph();
  const [selected, setSelected] = useState<ProofGraphNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, [selectedProfession.id]);

  const SVG_W = 860;
  const SVG_H = 580;

  // Use graph data from backend API if available
  const NODES: ProofGraphNode[] = graphData?.nodes || [];
  const EDGES = graphData?.edges || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0 }}>
              ProofGraph™
            </h1>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px',
              borderRadius: 4, background: `${selectedDomain.color}15`, color: selectedDomain.color,
              border: `1px solid ${selectedDomain.color}30`
            }}>
              {selectedProfession.name}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>
            Interactive verified capability map · {NODES.length} nodes · {EDGES.length} evidence connections
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {[
            { type: 'CAPABILITY', label: 'Capability', color: selectedDomain.color },
            { type: 'PROJECT', label: 'Verified Work', color: '#0284c7' },
            { type: 'ADR', label: 'Decision Log', color: '#7c3aed' },
            { type: 'REVIEW', label: 'Peer Review', color: '#059669' },
            { type: 'DEFENSE', label: 'Defense Round', color: '#d97706' },
          ].map(l => (
            <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)',
          padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} color="#ef4444" />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{error}</span>
          </div>
          <button onClick={() => refetch()} style={{ padding: '3px 8px', fontSize: '0.75rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', borderRadius: 4 }}>
            Retry
          </button>
        </div>
      )}

      {/* Graph + Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Graph canvas */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: '#f8fafc' }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Loading ProofGraph constellation...
            </div>
          )}

          {!loading && NODES.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${selectedDomain.color}15`, color: selectedDomain.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                No Verified ProofGraph Nodes Yet
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 420, margin: 0 }}>
                Complete and submit your first {selectedProfession.name} challenge to generate your cryptographic proof nodes and capability linkages.
              </p>
            </div>
          )}

          {!loading && NODES.length > 0 && (
            <svg
              width={SVG_W} height={SVG_H}
              style={{ display: 'block', minWidth: SVG_W }}
            >
              {/* Grid dots */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx={15} cy={15} r={1} fill="var(--border-subtle)" />
                </pattern>
              </defs>
              <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const fromNode = NODES.find(n => n.id === edge.from);
                const toNode = NODES.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const isHighlighted = hoveredId === edge.from || hoveredId === edge.to ||
                  (selected && (selected.id === edge.from || selected.id === edge.to));
                return (
                  <line
                    key={i}
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x} y2={toNode.y}
                    stroke={isHighlighted ? (selectedDomain.color || 'var(--accent-primary)') : 'var(--border-medium)'}
                    strokeWidth={isHighlighted ? 2 : 1.5}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map((node, i) => {
                const radius = NODE_RADIUS[node.type] || 28;
                const isHovered = hoveredId === node.id;
                const isSelected = selected?.id === node.id;
                const IconComponent = (NODE_TYPE_CONFIG[node.type] || NODE_TYPE_CONFIG.CAPABILITY).icon;
                const nodeColor = node.color || selectedDomain.color;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelected(node)}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      cursor: 'pointer',
                      opacity: mounted ? 1 : 0,
                      transition: `opacity 0.3s ease ${i * 0.04}s`,
                    }}
                  >
                    {/* Ripple / focus glow */}
                    {(isHovered || isSelected) && (
                      <circle
                        r={radius + 8}
                        fill={`${nodeColor}18`}
                        stroke={nodeColor}
                        strokeWidth={1}
                        style={{ transition: 'all 0.2s ease' }}
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      r={radius}
                      fill="var(--bg-surface)"
                      stroke={isSelected ? nodeColor : isHovered ? nodeColor : 'var(--border-medium)'}
                      strokeWidth={isSelected ? 3 : 2}
                      filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))"
                      style={{ transition: 'all 0.2s ease' }}
                    />

                    {/* Node interior text */}
                    {node.type === 'CAPABILITY' ? (
                      <>
                        <text
                          y={-6}
                          textAnchor="middle"
                          fill="var(--text-main)"
                          fontSize={10}
                          fontWeight={800}
                          fontFamily="var(--font-sans)"
                        >
                          {node.label.length > 12 ? node.label.slice(0, 10) + '..' : node.label}
                        </text>
                        <text
                          y={12}
                          textAnchor="middle"
                          fill={nodeColor}
                          fontSize={12}
                          fontWeight={900}
                          fontFamily="var(--font-mono)"
                        >
                          {node.score ?? 88}
                        </text>
                      </>
                    ) : (
                      <>
                        <text
                          y={2}
                          textAnchor="middle"
                          fill="var(--text-main)"
                          fontSize={9}
                          fontWeight={700}
                          fontFamily="var(--font-sans)"
                        >
                          {node.label.length > 10 ? node.label.slice(0, 8) + '..' : node.label}
                        </text>
                        {node.sublabel && (
                          <text
                            y={14}
                            textAnchor="middle"
                            fill="var(--text-muted)"
                            fontSize={7.5}
                            fontFamily="var(--font-sans)"
                          >
                            {node.sublabel}
                          </text>
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Selected Node Inspector Drawer */}
        {selected && (
          <div style={{
            width: 340, background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '1.5rem', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: selected.color || selectedDomain.color,
                background: `${selected.color || selectedDomain.color}15`,
                padding: '2px 8px', borderRadius: 4
              }}>
                {selected.type} Node
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
              {selected.label}
            </h3>
            {selected.sublabel && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                {selected.sublabel}
              </p>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                Evidence Chain & Artifacts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(selected.evidenceItems || []).map((ev, i) => (
                  <div key={i} style={{
                    padding: '8px 10px', background: 'var(--bg-subtle)',
                    borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <CheckCircle2 size={12} color="#059669" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
