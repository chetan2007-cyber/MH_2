import React from 'react';
import { Layers, Shield } from 'lucide-react';
import { Badge } from '../../../components/ui';

interface ReviewQueueSidebarProps {
  queue: any[];
  selectedSubId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const ReviewQueueSidebar: React.FC<ReviewQueueSidebarProps> = ({
  queue,
  selectedSubId,
  onSelect,
  loading,
}) => {
  return (
    <div className="forge-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={16} color="var(--cyan-primary)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Review Queue</h3>
        </div>
        <Badge variant="cyan">{queue.length} Pending</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loading ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
            Loading queue...
          </div>
        ) : queue.length === 0 ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
            No submissions waiting for review.
          </div>
        ) : (
          queue.map((item) => {
            const isSelected = selectedSubId === item.submissionId;
            return (
              <div
                key={item.submissionId}
                onClick={() => onSelect(item.submissionId)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isSelected ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <Badge variant="purple" size="sm">{item.challengeDifficulty || 'ADVANCED'}</Badge>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    BLIND #{item.submissionId.substring(18)}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {item.challengeTitle}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  <span>{item.adrsCount} ADRs</span>
                  <span>·</span>
                  <span>{item.p99LatencyMs}ms P99</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
