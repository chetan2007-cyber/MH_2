import React, { useState } from 'react';
import { FileCode2, Save, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Code, Eye } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface ADRStudioSectionProps {
  adrTitle?: string;
  setAdrTitle?: (v: string) => void;
  adrContext?: string;
  setAdrContext?: (v: string) => void;
  adrDecision?: string;
  setAdrDecision?: (v: string) => void;
  adrAlt1?: string;
  setAdrAlt1?: (v: string) => void;
  adrAlt1Reason?: string;
  setAdrAlt1Reason?: (v: string) => void;
  adrAlt2?: string;
  setAdrAlt2?: (v: string) => void;
  adrAlt2Reason?: string;
  setAdrAlt2Reason?: (v: string) => void;
  adrReasoning?: string;
  setAdrReasoning?: (v: string) => void;
  adrCitation?: string;
  setAdrCitation?: (v: string) => void;
  saving?: boolean;
  onSave?: () => void;
  existingADRs?: any[];
}

export const ADRStudioSection: React.FC<ADRStudioSectionProps> = ({
  adrTitle: propTitle,
  setAdrTitle: propSetTitle,
  adrContext: propContext,
  setAdrContext: propSetContext,
  adrDecision: propDecision,
  setAdrDecision: propSetDecision,
  saving = false,
  onSave,
  existingADRs = [],
}) => {
  // Document-editor states matching Section 16
  const [adrId, setAdrId] = useState('ADR-03');
  const [title, setTitle] = useState(propTitle || 'Use Redis for distributed rate limiting');
  const [context, setContext] = useState(
    propContext ||
      'Under peak flash-sale contention (25,000 req/sec targeting the same inventory row), relational row-locks cause cascading database connection pool starvation. We require a distributed rate limiter that operates with sub-millisecond overhead across 12 API gateway instances.'
  );
  const [decision, setDecision] = useState(
    propDecision ||
      'We will use Redis with a sliding window counter via a Lua script. This gives atomic evaluation of request rate limits across all distributed gateway nodes without introducing relational DB locks.'
  );
  const [alternatives, setAlternatives] = useState([
    {
      name: 'PostgreSQL Advisory Locks (Row-level tracking)',
      rejectionReason:
        'Contention creates transaction queue head-of-line blocking and spikes DB connection usage past pool limits.',
    },
    {
      name: 'In-Memory Local Token Bucket per Instance',
      rejectionReason:
        'Does not enforce global quota limits across 12 autoscaled gateway replicas during asymmetric routing.',
    },
  ]);
  const [reasoning, setReasoning] = useState(
    'Benchmarking proved Redis cluster Lua execution resolves rate-limit checks in 0.4ms P99, preserving our 10ms end-to-end SLA under 25k RPS stress harnesses.'
  );
  const [tradeoffs, setTradeoffs] = useState(
    'Introduces an operational dependency on a high-availability Redis cluster. If Redis encounters failover latency, we fail open for authenticated VIP traffic and fall back to conservative local rate-limiting.'
  );
  const [consequencesPositive, setConsequencesPositive] = useState([
    'Sub-millisecond global rate limiting enforcement',
    'Zero DB connection pool deadlocks or table locks',
    'Atomic sliding window counters via hermetic Lua scripts',
  ]);
  const [consequencesNegative, setConsequencesNegative] = useState([
    'Added network hop to Redis cache layer on every incoming request',
    'Requires Redis Sentinel or Cluster for automatic leader failover',
  ]);
  const [evidenceCitation, setEvidenceCitation] = useState('src/middleware/rate_limiter.go#L34-L88');
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = () => {
    if (propSetTitle) propSetTitle(title);
    if (propSetContext) propSetContext(context);
    if (propSetDecision) propSetDecision(decision);
    if (onSave) onSave();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Badge variant="cyan">ARCHITECTURAL REASONING</Badge>
            <Badge variant="emerald">STATUS: ACCEPTED</Badge>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Architecture Decision Record (ADR)
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Authoritative technical record explaining the rationale, alternatives, and trade-offs of key architectural choices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${previewMode ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setPreviewMode(!previewMode)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Eye size={14} />
            <span>{previewMode ? 'Edit Document' : 'Preview Document'}</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save size={14} />}
          >
            Save ADR
          </Button>
        </div>
      </div>

      {/* Document Canvas (Document Editor Feeling) */}
      <div
        className="forge-card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
          padding: '2.5rem',
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Document Metadata Banner */}
        <div
          style={{
            borderBottom: '2px solid var(--border-subtle)',
            paddingBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  background: 'var(--accent-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {adrId}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Deciders: Rahul Sharma (Author) · Senior Backend Reviewer (Auditor)
              </span>
            </div>

            {previewMode ? (
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {title}
              </h1>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  width: '100%',
                  border: 'none',
                  borderBottom: '1.5px dashed var(--border-medium)',
                  background: 'transparent',
                  padding: '0.25rem 0',
                  outline: 'none',
                }}
                placeholder="ADR Title..."
              />
            )}
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>Date: Today</div>
            <div>Verification: Passed</div>
          </div>
        </div>

        {/* 1. Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Context & Problem Statement
          </h3>
          {previewMode ? (
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {context}
            </p>
          ) : (
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* 2. Decision */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Decision
          </h3>
          {previewMode ? (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(79, 70, 229, 0.05)',
                borderLeft: '4px solid var(--accent-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9375rem',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {decision}
            </div>
          ) : (
            <textarea
              rows={3}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* 3. Considered Alternatives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Considered Alternatives & Rejection Reasons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  ❌ {alt.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--rose-error)' }}>Rejection Reason:</strong> {alt.rejectionReason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Reasoning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Reasoning
          </h3>
          {previewMode ? (
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {reasoning}
            </p>
          ) : (
            <textarea
              rows={2}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* 5. Trade-offs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Trade-offs
          </h3>
          {previewMode ? (
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {tradeoffs}
            </p>
          ) : (
            <textarea
              rows={2}
              value={tradeoffs}
              onChange={(e) => setTradeoffs(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* 6. Consequences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Consequences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(5, 150, 105, 0.05)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--emerald-verified)', marginBottom: '0.5rem' }}>
                Positive Consequences
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {consequencesPositive.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(217, 119, 6, 0.05)', border: '1px solid rgba(217, 119, 6, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--amber-warning)', marginBottom: '0.5rem' }}>
                Negative Consequences / Mitigations
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {consequencesNegative.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 7. Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Evidence & Code Citation
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
            <Code size={18} color="var(--accent-primary)" />
            <input
              type="text"
              value={evidenceCitation}
              onChange={(e) => setEvidenceCitation(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                color: 'var(--accent-primary)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                outline: 'none',
              }}
            />
            <Badge variant="emerald">VERIFIED IN REPO</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
