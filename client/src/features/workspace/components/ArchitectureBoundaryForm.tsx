import React from 'react';
import { Save } from 'lucide-react';
import { Button, Input } from '../../../components/ui';

interface ArchitectureBoundaryFormProps {
  archTitle: string;
  setArchTitle: (v: string) => void;
  archSummary: string;
  setArchSummary: (v: string) => void;
  dataFlow: string;
  setDataFlow: (v: string) => void;
  techExplanation: string;
  setTechExplanation: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}

export const ArchitectureBoundaryForm: React.FC<ArchitectureBoundaryFormProps> = ({
  archTitle,
  setArchTitle,
  archSummary,
  setArchSummary,
  dataFlow,
  setDataFlow,
  techExplanation,
  setTechExplanation,
  saving,
  onSave,
}) => {
  return (
    <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>System Architecture & Component Boundaries</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
          Document your architectural approach, concurrency primitives, and data consistency models.
        </p>
      </div>

      <Input
        label="Project / Service Title"
        value={archTitle}
        onChange={(e) => setArchTitle(e.target.value)}
        placeholder="High-Concurrency Flash-Sale Ingestion Engine"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          High-Level Architecture Summary
        </label>
        <textarea
          rows={3}
          value={archSummary}
          onChange={(e) => setArchSummary(e.target.value)}
          placeholder="Describe component isolation, state persistence, and concurrency boundaries..."
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Request Lifecycle & Data Flow
        </label>
        <textarea
          rows={3}
          value={dataFlow}
          onChange={(e) => setDataFlow(e.target.value)}
          placeholder="Client request -> Ingestion gateway -> In-memory lock-free CAS counter -> Async WAL..."
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Technical Explanation & Trade-Off Defense
        </label>
        <textarea
          rows={4}
          value={techExplanation}
          onChange={(e) => setTechExplanation(e.target.value)}
          placeholder="Explain why you chose this design, what alternatives you rejected, and how you ensured P99 sub-5ms..."
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={onSave} isLoading={saving} leftIcon={<Save size={15} />}>
          Save Architecture Specification
        </Button>
      </div>
    </div>
  );
};
