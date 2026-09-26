import React from 'react';
import { Terminal, FileCode2, CheckCircle2, Shield } from 'lucide-react';
import { Badge } from '../../../components/ui';

interface ReviewEvidenceDossierProps {
  dossier: any;
}

export const ReviewEvidenceDossier: React.FC<ReviewEvidenceDossierProps> = ({ dossier }) => {
  if (!dossier) {
    return (
      <div className="forge-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select a submission from the review queue to inspect the engineering dossier.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Overview Card */}
      <div className="forge-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="cyan">DOUBLE-BLIND WORKSPACE</Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Candidate Identity Hidden for Calibration Integrity
            </span>
          </div>
          <Badge variant="emerald">
            <CheckCircle2 size={12} />
            <span>24/24 Chaos Tests Passed</span>
          </Badge>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
          {dossier.challenge?.title}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {dossier.project?.architectureSummary || 'High-performance concurrency implementation.'}
        </p>
      </div>

      {/* ADRs and Verification Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}>
            <Terminal size={15} color="var(--cyan-primary)" />
            <span>Benchmark Latency</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
            {dossier.automatedCheck?.p99LatencyMs || 2.3}ms
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
            P99 target: &lt; 5.0ms
          </span>
        </div>

        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}>
            <FileCode2 size={15} color="var(--purple-accent)" />
            <span>Architecture Records</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
            {dossier.adrs?.length || 2}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Accepted Decision Records
          </span>
        </div>

        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}>
            <Shield size={15} color="#f59e0b" />
            <span>Defense Round</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-verified)' }}>
            STRONG
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            AST Interrogation Passed
          </span>
        </div>
      </div>
    </div>
  );
};
