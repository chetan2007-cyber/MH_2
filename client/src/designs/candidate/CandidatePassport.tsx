import React, { useState } from 'react';
import {
  CheckCircle2, Download, Share2, ExternalLink, Shield, Award,
  FileText, GitCommit, Star, SlidersHorizontal, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useProofPassport } from '../../hooks/useProofPassport';

interface CandidatePassportProps {
  user: any;
  onOpenDomainModal?: () => void;
}

export const CandidatePassport: React.FC<CandidatePassportProps> = ({ user, onOpenDomainModal }) => {
  const { selectedProfession, selectedDomain } = useCareer();
  const { passport, loading, error, refetch } = useProofPassport(user?._id || user?.id);
  const [copied, setCopied] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Candidate';
  const lastName = user?.name?.split(' ').slice(1).join(' ') || '';

  const handleCopy = () => {
    const url = passport?.publicShareToken
      ? `${window.location.origin}/proof/${passport.publicShareToken}`
      : `${window.location.origin}/proof/live`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const capabilities = passport?.capabilities || [];
  const verifiedDeliverables = passport?.verifiedDeliverables || [];
  const proofScore = passport?.proofScore ?? 0;
  const passportId = passport?.passportId || `KSH-${selectedProfession.id.slice(0, 3).toUpperCase()}-UNVERIFIED`;
  const cryptoHash = passport?.cryptographicHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const evidence = [
    { icon: GitCommit, label: `Verified Deliverables`, value: verifiedDeliverables.length, color: selectedDomain.color },
    { icon: CheckCircle2, label: 'Peer & Expert Reviews', value: verifiedDeliverables.reduce((acc, d) => acc + (d.reviewers?.length || 1), 0), color: '#059669' },
    { icon: FileText, label: 'Capabilities Unlocked', value: capabilities.length, color: '#7c3aed' },
    { icon: Shield, label: 'Verification Records', value: passport?.verificationHistory?.length || 0, color: '#d97706' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      {/* Section header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.375rem' }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: selectedDomain.color, margin: 0
          }}>Proof Passport™</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedDomain.name}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
          letterSpacing: '-0.04em', color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '0.375rem'
        }}>
          Your verified technical identity.
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Shareable proof of your verified {selectedProfession.name} capabilities. No self-reported claims or paper resume needed.
        </p>
      </div>

      {/* Error state with retry */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Failed to load proof passport from server</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{error}</div>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
              color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Try Again
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 20, padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)'
        }}>
          Generating verifiable cryptographic passport...
        </div>
      )}

      {/* The Passport Card */}
      {!loading && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Passport header band */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            padding: '2rem 2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.5rem',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Background grid pattern */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.05,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Brand + type */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: selectedDomain.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Award size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    KAUSHAL
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em' }}>
                    PROOF PASSPORT™
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '1.625rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {user?.name || 'Verified Professional'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
                {selectedProfession.name} · {selectedDomain.name} Domain
              </div>
            </div>

            {/* Overall score badge */}
            <div style={{
              position: 'relative', textAlign: 'right',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, padding: '1rem 1.5rem', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {proofScore > 0 ? proofScore : '--'}
              </div>
              <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginTop: 4 }}>
                PROOF SCORE / 100
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6,
                background: 'rgba(5,150,105,0.25)', border: '1px solid rgba(5,150,105,0.4)',
                borderRadius: 4, padding: '2px 7px'
              }}>
                <CheckCircle2 size={10} color="#10b981" />
                <span style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: 700 }}>
                  {proofScore > 0 ? 'VERIFIED' : 'PENDING EVALUATION'}
                </span>
              </div>
            </div>
          </div>

          {/* Passport body: Evidence stats + Capability Breakdown */}
          <div style={{ padding: '2rem 2.5rem' }}>
            {/* 4 evidence count blocks */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem', marginBottom: '2rem'
            }}>
              {evidence.map(e => (
                <div key={e.label} style={{
                  padding: '1rem', background: 'var(--bg-subtle)',
                  borderRadius: 10, border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: 12
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${e.color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <e.icon size={18} color={e.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {e.value}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 3 }}>
                      {e.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Capabilities breakdown bars */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Verified Capability Dimensions
              </div>
              {capabilities.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                  No capability dimensions verified yet. Complete challenges to populate your passport capabilities.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {capabilities.map(cap => (
                    <div key={cap.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>{cap.label}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: cap.color || selectedDomain.color, fontFamily: 'var(--font-mono)' }}>
                          {cap.score}/100
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${cap.score}%`,
                          background: `linear-gradient(90deg, ${cap.color || selectedDomain.color}, ${cap.color || selectedDomain.color}bb)`,
                          borderRadius: 3, transition: 'width 1s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Passport footer / machine-readable */}
          <div style={{
            background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: 3, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                PASSPORT ID · CRYPTOGRAPHIC PROOF HASH
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                {passportId} · {cryptoHash.slice(0, 16)}...
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                  border: '1px solid var(--border-subtle)', borderRadius: 8,
                  background: copied ? 'var(--emerald-subtle)' : 'var(--bg-surface)',
                  color: copied ? 'var(--emerald-verified)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? <CheckCircle2 size={14} /> : <Share2 size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified projects list */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)',
          letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Verified {selectedProfession.name} Projects & Deliverables
        </h2>

        {verifiedDeliverables.length === 0 ? (
          <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px dashed var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              No verified project submissions recorded yet. Once peer reviewers verify your challenge deliverables, they will be stamped on your public passport.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {verifiedDeliverables.map((proj, i) => (
              <div key={proj.id || i} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: '1.125rem 1.375rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <CheckCircle2 size={14} color="var(--emerald-verified)" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>{proj.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.domain}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Score: {proj.score}/100 · {proj.verifiedAt}
                    </span>
                  </div>
                </div>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                  border: '1px solid var(--border-subtle)', borderRadius: 7,
                  background: 'var(--bg-subtle)', color: 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, flexShrink: 0
                }}>
                  View proof <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
