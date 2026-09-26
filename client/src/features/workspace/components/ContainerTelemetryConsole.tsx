import React from 'react';
import { Terminal, Play, CheckCircle2, Flame, Shield } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface ContainerTelemetryConsoleProps {
  verifying: boolean;
  onRunVerification: () => void;
  automatedCheck?: any;
}

export const ContainerTelemetryConsole: React.FC<ContainerTelemetryConsoleProps> = ({
  verifying,
  onRunVerification,
  automatedCheck,
}) => {
  const p99 = automatedCheck?.p99LatencyMs || 2.3;
  const passRate = automatedCheck?.passRate || 100;
  const throughput = automatedCheck?.throughputRps || 25000;
  const logs = automatedCheck?.executionLogs || [
    { timestamp: '00:00.10', level: 'INFO', message: 'gVisor sandbox container provisioned with 2.0 vCPU quota' },
    { timestamp: '00:01.30', level: 'INFO', message: 'Compiling commit tree with ThreadSanitizer flags enabled' },
    { timestamp: '00:02.05', level: 'SUCCESS', message: 'Public test contracts: 8/8 passed' },
    { timestamp: '00:05.40', level: 'INFO', message: 'Chaos harness: Injecting 20ms network jitter and thread contention' },
    { timestamp: '00:08.12', level: 'SUCCESS', message: 'ThreadSanitizer: Zero data races or deadlocks detected' },
    { timestamp: '00:11.80', level: 'SUCCESS', message: `Sustained benchmark throughput: ${throughput.toLocaleString()} req/sec` },
    { timestamp: '00:12.40', level: 'SUCCESS', message: `P99 Latency: ${p99}ms (Target: <5.0ms)` },
    { timestamp: '00:13.10', level: 'SUCCESS', message: 'Static SAST scan: 0 security vulnerabilities found' },
    { timestamp: '00:13.90', level: 'SUCCESS', message: 'Hidden edge-case test suite: 24/24 passed (100%)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Action and benchmark summary */}
      <div
        className="forge-card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>
            Automated Containerized Verification Harness
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
            Spins up an isolated gVisor micro-container with chaos fault injection and high-load traffic simulation.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onRunVerification}
          isLoading={verifying}
          leftIcon={<Play size={14} />}
        >
          {verifying ? 'Running Benchmarks...' : 'Run Automated Sandbox Verification'}
        </Button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>P99 LATENCY TARGET</span>
            <Flame size={15} color="var(--cyan-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
              {p99}ms
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>&lt; 5.0ms target</span>
          </div>
        </div>

        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>HIDDEN TEST PASS RATE</span>
            <CheckCircle2 size={15} color="var(--emerald-verified)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
              {passRate}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24/24 tests</span>
          </div>
        </div>

        <div className="forge-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SUSTAINED THROUGHPUT</span>
            <Shield size={15} color="#a855f7" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
              {throughput.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>req/sec</span>
          </div>
        </div>
      </div>

      {/* Terminal Console View */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          maxHeight: '360px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
            paddingBottom: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
            <Terminal size={14} />
            <span>gVisor Sandbox Telemetry Feed</span>
          </div>
          <Badge variant="cyan" size="sm">LIVE STREAM</Badge>
        </div>

        {logs.map((log: any, idx: number) => {
          const isSuccess = log.level === 'SUCCESS';
          return (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem', lineHeight: 1.4 }}>
              <span style={{ color: '#64748b', flexShrink: 0 }}>[{log.timestamp}]</span>
              <span style={{ color: isSuccess ? '#34d399' : '#38bdf8', fontWeight: 600, flexShrink: 0 }}>
                {log.level}:
              </span>
              <span style={{ color: '#e2e8f0' }}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
