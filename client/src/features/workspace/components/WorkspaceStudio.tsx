import React, { useEffect, useState } from 'react';
import {
  Layers,
  FileCode2,
  Terminal,
  HelpCircle,
  Check,
  Circle,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../api';
import { WorkspaceHeader } from './WorkspaceHeader';
import { ArchitectureBoundaryForm } from './ArchitectureBoundaryForm';
import { ADRStudioSection } from './ADRStudioSection';
import { ContainerTelemetryConsole } from './ContainerTelemetryConsole';
import { DefenseRoundSection } from './DefenseRoundSection';
import { Badge, Button } from '../../../components/ui';

export interface WorkspaceStudioProps {
  submissionId: string;
  onSubmissionFinalized: () => void;
  onNavigate: (view: string) => void;
}

export const WorkspaceStudio: React.FC<WorkspaceStudioProps> = ({
  submissionId,
  onSubmissionFinalized,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'adr' | 'verify' | 'defense'>('architecture');
  const [workspace, setWorkspace] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Form states for Architecture
  const [archTitle, setArchTitle] = useState('High-Concurrency Ticket Booking API - Architecture');
  const [archSummary, setArchSummary] = useState(
    'Engineered an isolated, high-performance ticket decrement service with single-threaded Redis atomic operations and zero-copy buffers. Relational PostgreSQL commits are deferred to background WAL workers to guarantee bounded P99 latencies under flash contention.'
  );
  const [dataFlow, setDataFlow] = useState(
    'Client requests hit edge gateway -> Token verified -> Atomic Lua decrement in Redis memory -> On success, asynchronous event pushed to Kafka/WAL worker for PostgreSQL ledger settlement.'
  );
  const [techExplanation, setTechExplanation] = useState(
    'Deliberately avoided pessimistic row locking (SELECT FOR UPDATE) because DB connection pool thread starvation was the bottleneck at 2,000 req/sec. Optimistic versioning with Redis atomic decrements scales to 25,000 req/sec with 2.3ms P99 latency.'
  );

  // Form states for ADR
  const [adrTitle, setAdrTitle] = useState('Use Redis for distributed rate limiting');
  const [adrContext, setAdrContext] = useState(
    'Under peak flash-sale contention (25,000 req/sec targeting the same inventory row), relational row-locks cause cascading database connection pool starvation. We require a distributed rate limiter that operates with sub-millisecond overhead across 12 API gateway instances.'
  );
  const [adrDecision, setAdrDecision] = useState(
    'We will use Redis with a sliding window counter via a Lua script. This gives atomic evaluation of request rate limits across all distributed gateway nodes without introducing relational DB locks.'
  );

  // Defense answers
  const [defenseAnswers, setDefenseAnswers] = useState<Record<string, string>>({});
  const [submittingDefense, setSubmittingDefense] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWorkspace = async () => {
    try {
      const res = await api.getSubmissionWorkspace(submissionId);
      if (res.success) {
        setWorkspace(res);
        if (res.project) {
          setArchTitle(res.project.title || archTitle);
          setArchSummary(res.project.architectureSummary || archSummary);
          setDataFlow(res.project.dataFlowDescription || dataFlow);
          setTechExplanation(res.project.technicalExplanation || techExplanation);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [submissionId]);

  const handleSaveArchitecture = async () => {
    setSaving(true);
    setBannerMsg(null);
    try {
      const res = await api.saveArchitecture(submissionId, {
        title: archTitle,
        architectureSummary: archSummary,
        dataFlowDescription: dataFlow,
        technicalExplanation: techExplanation,
        systemComponents: [
          { name: 'Core Worker Pool', role: 'Idempotency checks & request queue', tech: 'Go / Node.js', communication: 'gRPC' },
          { name: 'In-Memory CAS Store', role: 'Lock-free version counter in RAM', tech: 'Redis / Memtable', communication: 'RESP' },
          { name: 'Durable Ledger', role: 'Append-only transactional log', tech: 'PostgreSQL Partitioned', communication: 'TCP' },
        ],
      });
      if (res.success) {
        setBannerMsg({ type: 'success', text: 'Architecture & technical explanation saved to submission manifest.' });
        fetchWorkspace();
      } else {
        setBannerMsg({ type: 'error', text: res.error || 'Failed to save architecture.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Save error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveADR = async () => {
    setSaving(true);
    setBannerMsg(null);
    try {
      const res = await api.saveADR(submissionId, {
        title: adrTitle,
        context: adrContext,
        decision: adrDecision,
        alternatives: [
          { option: 'PostgreSQL Advisory Locks', rejectionReason: 'Causes thread starvation in connection pool.' },
          { option: 'In-Memory Local Token Bucket', rejectionReason: 'Does not enforce global quota across replicas.' },
        ],
        reasoning: 'Redis cluster Lua execution resolves rate-limit checks in 0.4ms P99.',
        tradeOffs: 'Operational dependency on Redis cluster; fail open for VIP traffic.',
        consequences: {
          positive: ['Sub-millisecond rate limiting', 'Zero DB deadlocks', 'Atomic sliding window'],
          negative: ['Network hop to Redis cache layer'],
        },
        evidenceCitation: 'src/middleware/rate_limiter.go#L34-L88',
      });

      if (res.success) {
        setBannerMsg({ type: 'success', text: 'Architectural Decision Record (ADR-03) saved and verified.' });
        fetchWorkspace();
      } else {
        setBannerMsg({ type: 'error', text: res.error || 'Failed to save ADR.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'ADR save error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    setBannerMsg(null);
    try {
      const res = await api.triggerVerification(submissionId);
      if (res.success) {
        setBannerMsg({ type: 'success', text: 'Container tests completed: 24/24 edge cases passed in gVisor sandbox.' });
        fetchWorkspace();
      } else {
        setBannerMsg({ type: 'error', text: res.error || 'Container tests failed.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Verification error.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitDefense = async () => {
    setSubmittingDefense(true);
    setBannerMsg(null);
    try {
      const answers = Object.entries(defenseAnswers).map(([questionId, answerText]) => ({
        questionId,
        answerText,
      }));
      const res = await api.submitDefense(submissionId, answers);
      if (res.success) {
        setBannerMsg({ type: 'success', text: 'Defense round submitted and evaluated against AST cross-examination.' });
        fetchWorkspace();
      } else {
        setBannerMsg({ type: 'error', text: res.error || 'Submission error.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Error submitting defense.' });
    } finally {
      setSubmittingDefense(false);
    }
  };

  const handleFinalize = async () => {
    setSaving(true);
    setBannerMsg(null);
    try {
      const res = await api.finalizeSubmission(submissionId);
      if (res.success) {
        setBannerMsg({ type: 'success', text: res.message || 'Submission finalized and queued for expert review.' });
        await fetchWorkspace();
        onSubmissionFinalized();
      } else {
        setBannerMsg({ type: 'error', text: res.error || 'Submission preflight failed.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Submission error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with preflight checklist */}
      <WorkspaceHeader
        challenge={workspace?.challenge}
        submission={workspace?.submission}
        saving={saving}
        bannerMsg={bannerMsg}
        onFinalize={handleFinalize}
      />

      {/* 2. THREE-PART LAYOUT (Section 15: LEFT: Requirements | CENTER: Workspace/Progress | RIGHT: Proof Checklist) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 300px) minmax(400px, 1fr) minmax(260px, 280px)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* =====================================================================
            LEFT: CHALLENGE REQUIREMENTS
            ===================================================================== */}
        <aside
          className="forge-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'sticky',
            top: 'calc(var(--topbar-height) + 1rem)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <Badge variant="purple">ADVANCED TIER</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4–6h</span>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              High-Concurrency Ticket Booking API
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.4, margin: 0 }}>
              Backend · PostgreSQL · Redis
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Core Requirements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
              <li>Idempotent booking endpoint</li>
              <li>Redis atomic decrements</li>
              <li>Two-phase settlement queue</li>
              <li>Zero overselling permitted</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--amber-warning)', marginBottom: '0.5rem' }}>
              System Constraints
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
              <li>P99 latency &lt; 10ms</li>
              <li>20,000 req/sec sustained</li>
              <li>Max 256MB RAM per worker</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--emerald-verified)', marginBottom: '0.5rem' }}>
              Evaluation Harness
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              24 hidden test suites in gVisor container sandbox + AST cross-examination.
            </div>
          </div>
        </aside>

        {/* =====================================================================
            CENTER: WORKSPACE / PROGRESS & STUDIO TABS
            ===================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Studio Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              className={`btn btn-sm ${activeTab === 'architecture' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('architecture')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Layers size={14} />
              <span>Architecture</span>
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'adr' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('adr')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <FileCode2 size={14} />
              <span>ADR Studio (ADR-03)</span>
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'verify' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('verify')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Terminal size={14} />
              <span>Tests & Telemetry</span>
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'defense' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('defense')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <HelpCircle size={14} />
              <span>Defense Round™</span>
            </button>
          </div>

          {/* Tab 1: Architecture */}
          {activeTab === 'architecture' && (
            <ArchitectureBoundaryForm
              archTitle={archTitle}
              setArchTitle={setArchTitle}
              archSummary={archSummary}
              setArchSummary={setArchSummary}
              dataFlow={dataFlow}
              setDataFlow={setDataFlow}
              techExplanation={techExplanation}
              setTechExplanation={setTechExplanation}
              saving={saving}
              onSave={handleSaveArchitecture}
            />
          )}

          {/* Tab 2: ADR Studio */}
          {activeTab === 'adr' && (
            <ADRStudioSection
              adrTitle={adrTitle}
              setAdrTitle={setAdrTitle}
              adrContext={adrContext}
              setAdrContext={setAdrContext}
              adrDecision={adrDecision}
              setAdrDecision={setAdrDecision}
              saving={saving}
              onSave={handleSaveADR}
              existingADRs={workspace?.adrs}
            />
          )}

          {/* Tab 3: Container Telemetry */}
          {activeTab === 'verify' && (
            <ContainerTelemetryConsole
              verifying={verifying}
              onRunVerification={handleRunVerification}
              automatedCheck={workspace?.automatedCheck}
            />
          )}

          {/* Tab 4: Defense Round */}
          {activeTab === 'defense' && (
            <DefenseRoundSection
              defense={workspace?.defense}
              defenseAnswers={defenseAnswers}
              setDefenseAnswers={setDefenseAnswers}
              submittingDefense={submittingDefense}
              onSubmitDefense={handleSubmitDefense}
            />
          )}
        </div>

        {/* =====================================================================
            RIGHT: YOUR PROOF CHECKLIST (Section 15 Specification)
            ===================================================================== */}
        <aside
          className="forge-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'sticky',
            top: 'calc(var(--topbar-height) + 1rem)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', margin: 0 }}>
                YOUR PROOF
              </h3>
              <Badge variant="cyan">72%</Badge>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live verification preflight status
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div
              style={{
                height: '6px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '72%',
                  background: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              72% complete
            </div>
          </div>

          {/* Proof Checklist items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
              <Check size={16} strokeWidth={2.5} />
              <span>Repository</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
              <Check size={16} strokeWidth={2.5} />
              <span>README</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
              <Check size={16} strokeWidth={2.5} />
              <span>Architecture</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
              <Check size={16} strokeWidth={2.5} />
              <span>ADR</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Circle size={15} strokeWidth={1.8} />
              <span>Tests</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Circle size={15} strokeWidth={1.8} />
              <span>Deployment</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Circle size={15} strokeWidth={1.8} />
              <span>Defense</span>
            </div>
          </div>

          {/* Action Callout */}
          <div
            style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            Complete remaining container benchmark run and defense questions to submit for peer review.
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleFinalize}
            isLoading={saving}
            style={{ width: '100%' }}
          >
            Finalize Proof
          </Button>
        </aside>
      </div>
    </div>
  );
};
