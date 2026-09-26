import React, { useState } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight,
  Terminal, FileText, Cpu, Shield, Layers,
  GitCommit, Clock, BarChart2, Zap
} from 'lucide-react';

// Thin wrapper that reuses the existing WorkspaceStudio for actual IDE functionality
import { WorkspaceStudio } from '../../features/workspace/components/WorkspaceStudio';

interface CandidateWorkspaceViewProps {
  submissionId: string;
  onExit: () => void;
}

// Proof checklist item
const CheckItem: React.FC<{
  label: string; done?: boolean; active?: boolean; sublabel?: string;
}> = ({ label, done, active, sublabel }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 8,
    padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
  }}>
    <div style={{ marginTop: 1, flexShrink: 0 }}>
      {done
        ? <CheckCircle2 size={14} color="#6ee7b7" />
        : active
          ? <div style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid #818cf8', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#818cf8' }} />
            </div>
          : <Circle size={14} color="#475569" />
      }
    </div>
    <div>
      <div style={{
        fontSize: '0.75rem', fontWeight: done ? 600 : 500,
        color: done ? '#94a3b8' : active ? '#e2e8f0' : '#64748b',
        textDecoration: done ? 'line-through' : 'none'
      }}>{label}</div>
      {sublabel && (
        <div style={{ fontSize: '0.625rem', color: '#475569', marginTop: 2 }}>{sublabel}</div>
      )}
    </div>
  </div>
);

// Section header for proof checklist
const CheckSection: React.FC<{
  label: string; icon: React.ReactNode; complete: number; total: number;
  children: React.ReactNode;
}> = ({ label, icon, complete, total, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '6px 0', marginBottom: open ? 4 : 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: complete === total ? '#6ee7b7' : '#818cf8', display: 'flex' }}>{icon}</span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#94a3b8' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.6875rem', color: complete === total ? '#6ee7b7' : '#64748b',
            fontFamily: 'var(--font-mono)' }}>
            {complete}/{total}
          </span>
          {open ? <ChevronDown size={12} color="#475569"/> : <ChevronRight size={12} color="#475569"/>}
        </div>
      </button>
      {open && <div style={{ paddingLeft: 4 }}>{children}</div>}
    </div>
  );
};

export const CandidateWorkspaceView: React.FC<CandidateWorkspaceViewProps> = ({
  submissionId, onExit
}) => {
  // The existing WorkspaceStudio handles the actual content
  // We render it inside a dark IDE wrapper with our enhanced proof checklist on the right
  return (
    <WorkspaceStudio
      submissionId={submissionId}
      onSubmissionFinalized={onExit}
      onNavigate={() => {}}
    />
  );
};
