import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Layers, Cpu, Clock, ExternalLink } from 'lucide-react';
import { api } from '../api';

interface PublicProofViewProps {
  token: string;
  onNavigateHome: () => void;
}

export const PublicProofView: React.FC<PublicProofViewProps> = ({ token, onNavigateHome }) => {
  const [proof, setProof] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicProof();
  }, [token]);

  const fetchPublicProof = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPublicProof(token);
      const passportData = res.data || (res as any).publicPassport;
      if (res.success && passportData) {
        setProof(passportData);
      } else {
        setError(res.error || 'Public proof verification failed or token was revoked.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching public proof.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
        Verifying cryptographic proof token...
      </div>
    );
  }

  if (error || !proof) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="proof-card" style={{ padding: '3rem 2rem' }}>
          <div style={{ color: 'var(--rose-danger)', marginBottom: '1rem', fontSize: '2.5rem' }}>✕</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Invalid or Revoked Proof Link</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {error || 'This proof link is either expired, non-existent, or has been revoked by the engineer.'}
          </p>
          <button className="btn btn-primary" onClick={onNavigateHome}>
            Go to ProofForge Talent Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Cryptographic Authenticity Banner */}
      <div
        style={{
          background: 'var(--emerald-subtle)',
          border: '1px solid var(--emerald-verified)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontSize: '0.875rem', fontWeight: 600 }}>
          <ShieldCheck size={18} />
          <span>Cryptographically Verified Proof-of-Work Engineering Passport</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Public Verification Hash: <span className="font-mono">{token.substring(0, 12)}...</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="proof-card proof-card-highlight" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-cyan">PUBLIC PROOF PASSPORT™</span>
              <span className="badge badge-emerald">{proof.verificationLevel?.replace(/_/g, ' ') || 'CHAOS VERIFIED'}</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{proof.candidateName}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{proof.headline}</p>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Location: {proof.location}</div>
          </div>

          <div
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Proof Confidence
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-verified)' }}>
              {proof.proofConfidence}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Double-Blind Consensus</div>
          </div>
        </div>
      </div>

      {/* Verified Capabilities */}
      <div className="proof-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          Verified Capabilities (Backed by Container Telemetry)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {proof.capabilities?.map((cap: any) => (
            <div key={cap.dimension} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cap.displayName}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--cyan-primary)' }}>{cap.score}</strong>
              </div>
              <div className="progress-bar-container" style={{ marginBottom: '0.75rem' }}>
                <div className="progress-bar-fill" style={{ width: `${cap.score}%` }}></div>
              </div>
              <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {cap.explanationSummary?.slice(0, 2).map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Work Projects */}
      <div className="proof-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          Demonstrated Engineering Work & ADRs
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {proof.verifiedProjects?.map((proj: any, idx: number) => (
            <div key={idx} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-purple">{proj.difficulty}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-verified)', fontWeight: 600 }}>
                  P99: {proj.p99LatencyMs}ms (100% Tests Passed)
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{proj.title}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {proj.architectureSummary}
              </p>

              {/* ADR summary */}
              {proj.adrsList?.length > 0 && (
                <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-primary)', marginBottom: '0.25rem' }}>
                    Documented Decision: {proj.adrsList[0].title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Trade-off:</strong> {proj.adrsList[0].tradeOffs}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {proj.techStack?.map((t: string) => (
                  <span key={t} style={{ fontSize: '0.7rem', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
