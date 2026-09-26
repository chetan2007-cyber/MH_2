import React from 'react';
import { Activity, CheckCircle2, FileCode, MessageSquare, Send } from 'lucide-react';
import { Badge } from '../../../components/ui';

export const EngineeringActivity: React.FC = () => {
  const activities = [
    {
      timeframe: 'Today',
      title: 'Defense Round completed',
      detail: 'AST cross-examination verified genuine technical ownership and failure-mode handling.',
      icon: <CheckCircle2 size={16} color="var(--emerald-verified)" />,
      badge: 'VERIFIED',
      badgeVariant: 'emerald',
    },
    {
      timeframe: 'Yesterday',
      title: 'ADR #03 updated',
      detail: '"Use Redis for distributed rate limiting" updated with 2 rejected alternatives.',
      icon: <FileCode size={16} color="var(--accent-primary)" />,
      badge: 'DOCUMENTED',
      badgeVariant: 'cyan',
    },
    {
      timeframe: '2 days ago',
      title: 'Reviewer feedback received',
      detail: 'Senior Backend Reviewer provided 8-dimension rubric audit with code citations.',
      icon: <MessageSquare size={16} color="var(--purple-accent)" />,
      badge: 'AUDITED',
      badgeVariant: 'purple',
    },
    {
      timeframe: '4 days ago',
      title: 'Project submitted',
      detail: 'Initial repository tree, architecture diagram, and container smoke suite pushed.',
      icon: <Send size={16} color="var(--cyan-primary)" />,
      badge: 'SUBMITTED',
      badgeVariant: 'slate',
    },
  ];

  return (
    <div className="forge-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Recent Engineering Activity</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cryptographically Anchored</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {activities.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            {/* Timeline icon indicator */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.15rem',
              }}
            >
              {item.icon}
            </div>

            {/* Timeline Content */}
            <div style={{ flex: 1, paddingBottom: idx < activities.length - 1 ? '0.75rem' : '0', borderBottom: idx < activities.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.timeframe}
                  </span>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0, lineHeight: 1.4 }}>
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
