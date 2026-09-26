import React from 'react';
import { Send, Award } from 'lucide-react';
import { Button, Input } from '../../../components/ui';

interface ReviewRubricFormProps {
  rubric: Record<string, { score: number; citation: string; rationale: string }>;
  setRubric: React.Dispatch<React.SetStateAction<Record<string, { score: number; citation: string; rationale: string }>>>;
  qualitative: string;
  setQualitative: (v: string) => void;
  submitting: boolean;
  onSubmit: () => void;
}

export const ReviewRubricForm: React.FC<ReviewRubricFormProps> = ({
  rubric,
  setRubric,
  qualitative,
  setQualitative,
  submitting,
  onSubmit,
}) => {
  const updateDimension = (key: string, field: 'score' | 'citation' | 'rationale', val: any) => {
    setRubric((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
  };

  return (
    <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            Calibrated 8-Dimension Evaluation Rubric
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
            Mandatory code citations and objective criteria enforce anti-inflation calibration.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-primary)' }}>
          <Award size={18} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>RRI Calibration Weight: 1.45x</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {Object.entries(rubric).map(([dimKey, dimVal]) => (
          <div
            key={dimKey}
            style={{
              padding: '0.875rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' }}>
                {dimKey.replace(/([A-Z])/g, ' $1')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={dimVal.score}
                  onChange={(e) => updateDimension(dimKey, 'score', Number(e.target.value))}
                  style={{
                    width: '44px',
                    padding: '2px 4px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 10</span>
              </div>
            </div>

            <Input
              placeholder="Code citation (e.g., src/concurrency/cas_lock.go#L45)"
              value={dimVal.citation}
              onChange={(e) => updateDimension(dimKey, 'citation', e.target.value)}
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            />

            <textarea
              rows={2}
              placeholder="Audit rationale and engineering evaluation..."
              value={dimVal.rationale}
              onChange={(e) => updateDimension(dimKey, 'rationale', e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: '0.75rem',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Qualitative Synthesis & Senior Engineering Commentary
        </label>
        <textarea
          rows={3}
          value={qualitative}
          onChange={(e) => setQualitative(e.target.value)}
          placeholder="Synthesize the candidate's engineering trade-offs, architecture decisions, and code maturity..."
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
        <Button variant="primary" onClick={onSubmit} isLoading={submitting} rightIcon={<Send size={15} />}>
          Submit Calibrated Double-Blind Evaluation
        </Button>
      </div>
    </div>
  );
};
