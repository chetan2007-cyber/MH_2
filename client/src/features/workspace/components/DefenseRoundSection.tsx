import React from 'react';
import { HelpCircle, CheckCircle2, Save } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface DefenseRoundSectionProps {
  defense?: any;
  defenseAnswers: Record<string, string>;
  setDefenseAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  submittingDefense: boolean;
  onSubmitDefense: () => void;
}

export const DefenseRoundSection: React.FC<DefenseRoundSectionProps> = ({
  defense,
  defenseAnswers,
  setDefenseAnswers,
  submittingDefense,
  onSubmitDefense,
}) => {
  const questions = defense?.questions || [
    {
      id: 'q1',
      prompt: 'Why did you choose optimistic concurrency over Redis Redlock in ADR-001?',
      category: 'ARCHITECTURE_RATIONALE',
      contextSnippet: 'ADR-001 line 12',
    },
    {
      id: 'q2',
      prompt: 'What failure mode occurs first if traffic surges by 10x?',
      category: 'SCALABILITY_FAILURE_MODE',
      contextSnippet: 'Database connection pool bounds',
    },
    {
      id: 'q3',
      prompt: 'Explain how your code prevents orphaned reservations if a worker crashes mid-transaction.',
      category: 'CODE_EXPLANATION',
      contextSnippet: 'src/concurrency/cas_lock.go',
    },
  ];

  const isEvaluated = defense?.status === 'EVALUATED';

  return (
    <div className="forge-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--amber-warning)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Defense Round™: AST Cross-Examination
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
            Answer targeted questions about your implementation to prove engineering authorship and reasoning depth.
          </p>
        </div>

        {isEvaluated && (
          <Badge variant="emerald" size="md">
            <CheckCircle2 size={14} />
            <span>CONFIDENCE: {defense.confidence || 'STRONG'}</span>
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {questions.map((q: any, idx: number) => {
          const currentVal = defenseAnswers[q.id] || (defense?.answers?.find((a: any) => a.questionId === q.id)?.answerText || '');
          return (
            <div
              key={q.id || idx}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  QUESTION {idx + 1} · {q.category || 'TECHNICAL MASTERY'}
                </span>
                {q.contextSnippet && (
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                    {q.contextSnippet}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {q.prompt}
              </div>

              <textarea
                rows={3}
                disabled={isEvaluated}
                value={currentVal}
                onChange={(e) => setDefenseAnswers({ ...defenseAnswers, [q.id]: e.target.value })}
                placeholder="Explain the architectural reasoning, trade-offs, and failure mode mitigations..."
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
          );
        })}
      </div>

      {!isEvaluated && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={onSubmitDefense} isLoading={submittingDefense} leftIcon={<Save size={15} />}>
            Submit Defense Cross-Examination Answers
          </Button>
        </div>
      )}
    </div>
  );
};
