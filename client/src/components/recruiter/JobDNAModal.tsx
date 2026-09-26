import React, { useState } from 'react';
import { Sparkles, X, Check, Dna, Cpu, Shield, Plus, Trash2, ArrowRight } from 'lucide-react';
import { jobService } from '../../services/job.service';
import { useToast } from '../Toast';
import type { Job, CompetencyItem } from '../../types/api';

interface JobDNAModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedJob: Job) => void;
  onOpenAssessmentGen?: () => void;
}

export const JobDNAModal: React.FC<JobDNAModalProps> = ({
  job,
  isOpen,
  onClose,
  onUpdated,
  onOpenAssessmentGen,
}) => {
  const { showToast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(job.competencies || []);

  if (!isOpen) return null;

  const handleGenerateDNA = async () => {
    setAnalyzing(true);
    try {
      const updated = await jobService.generateJobDNA(job._id);
      setCompetencies(updated.competencies || []);
      onUpdated(updated);
      showToast('success', 'Job DNA Generated', 'Extracted technical dimensions and competency model.');
    } catch (err: any) {
      showToast('error', 'DNA Analysis Failed', err.message || 'Failed to synthesize Job DNA.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleWeightChange = (index: number, newWeight: number) => {
    const next = [...competencies];
    next[index] = { ...next[index], weight: Math.max(0, Math.min(100, newWeight)) };
    setCompetencies(next);
  };

  const totalWeight = competencies.reduce((sum, c) => sum + Number(c.weight || 0), 0);

  const handleSaveWeights = async () => {
    if (totalWeight !== 100) {
      showToast('error', 'Weight Mismatch', `Total weight must sum exactly to 100% (currently ${totalWeight}%).`);
      return;
    }

    setSavingWeights(true);
    try {
      const updated = await jobService.updateCompetencies(job._id, competencies);
      onUpdated(updated);
      showToast('success', 'Competencies Updated', 'Competency weights calibrated for assessment generator.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setSavingWeights(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          maxWidth: 860,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Dna size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
                  Autonomous Job DNA & Competency Model
                </span>
                <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 4, background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  {job.careerDomain}
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 0', letterSpacing: '-0.02em' }}>
                {job.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Job DNA Card */}
          {job.jobDNA ? (
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Synthesized Job DNA Dimensions
                </div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} /> AI Calibrated
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mandatory Experience</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{job.experience}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Target Difficulty</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: 4 }}>{job.difficulty}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Practical Duration</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{job.assessmentDurationMinutes} mins</div>
                </div>
              </div>

              {/* Mandatory requirements */}
              {job.jobDNA.mandatoryRequirements && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Mandatory Proof Criteria:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {job.jobDNA.mandatoryRequirements.map((req, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px dashed var(--border-medium)', borderRadius: 14 }}>
              <Sparkles size={32} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                Job DNA Not Synthesized Yet
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                Extract objective competencies, mandatory requirements, and evaluation vectors from the requisition.
              </p>
              <button
                onClick={handleGenerateDNA}
                disabled={analyzing}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Dna size={16} />
                {analyzing ? 'Synthesizing Job DNA...' : 'Generate Job DNA'}
              </button>
            </div>
          )}

          {/* Competency Weight Tuning */}
          {competencies.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Competency Weights (Evaluation Rubric Blueprint)
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Adjust how much weight the AI evaluator assigns to each practical competency.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: totalWeight === 100 ? '#059669' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: totalWeight === 100 ? '#05966914' : '#dc262614',
                  }}
                >
                  Total: {totalWeight}% / 100%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {competencies.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {comp.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {comp.description}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={comp.weight}
                        onChange={e => handleWeightChange(idx, Number(e.target.value))}
                        style={{ width: 120, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', width: 45, textAlign: 'right' }}>
                        {comp.weight}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={handleGenerateDNA}
            disabled={analyzing}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Dna size={14} />
            {analyzing ? 'Regenerating...' : 'Regenerate DNA'}
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSaveWeights}
              disabled={savingWeights || totalWeight !== 100}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {savingWeights ? 'Saving...' : 'Save Competency Weights'}
            </button>
            {onOpenAssessmentGen && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAssessmentGen();
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Generate Assessment</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
