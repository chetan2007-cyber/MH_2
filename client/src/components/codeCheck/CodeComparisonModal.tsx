import React, { useState } from 'react';
import {
  X, Check, AlertTriangle, Shield, CheckCircle2,
  FileCode, Layers, ArrowLeftRight, HelpCircle
} from 'lucide-react';
import {
  codeCheckService,
  type CodeAnalysisResult,
  type MatchedSubmission
} from '../../services/codeCheck.service';

interface CodeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CodeAnalysisResult | null;
  onVerified?: (updated: CodeAnalysisResult) => void;
}

export const CodeComparisonModal: React.FC<CodeComparisonModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onVerified,
}) => {
  const [selectedMatchIdx, setSelectedMatchIdx] = useState(0);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [savedDecision, setSavedDecision] = useState<string | null>(null);

  if (!isOpen || !analysis) return null;

  const matchedList = analysis.matchedSubmissions || [];
  const currentMatch: MatchedSubmission | undefined = matchedList[selectedMatchIdx];

  const candidateLines = (analysis.codeSnippet || '').split('\n');
  const matchedLines = (currentMatch?.similarSnippet || '// No peer source snippet captured in archive.').split('\n');

  const handleDecision = async (decision: 'VERIFIED' | 'NEEDS_REVIEW' | 'NOT_VERIFIED') => {
    setUpdating(true);
    try {
      const res = await codeCheckService.verifyIntegrity({
        analysisId: analysis._id,
        decision,
        notes: decisionNotes || `Reviewer marked status as ${decision}`,
      });
      setSavedDecision(decision);
      if (onVerified) onVerified(res);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to submit reviewer decision:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getSignalBadge = (score: number) => {
    if (score <= 25) return { text: 'LOW', bg: 'rgba(5,150,105,0.1)', color: '#059669' };
    if (score <= 60) return { text: 'MODERATE', bg: 'rgba(217,119,6,0.1)', color: '#d97706' };
    return { text: 'HIGH', bg: 'rgba(234,88,12,0.12)', color: '#ea580c' };
  };

  const signal = getSignalBadge(analysis.similarityScore);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          maxHeight: '92vh',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
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
                width: 36,
                height: 36,
                borderRadius: 8,
                background: signal.bg,
                color: signal.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Code Similarity Evidence Comparison
                </h2>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: signal.bg,
                    color: signal.color,
                    letterSpacing: '0.05em',
                  }}
                >
                  SIGNAL: {signal.text}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Normalized structural comparison between candidate submission and peer submissions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Metric Summary Bar */}
        <div
          style={{
            padding: '0.875rem 1.75rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overall Similarity
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: signal.color, fontFamily: 'var(--font-mono)' }}>
                {analysis.similarityScore}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Compared Against
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentMatch?.candidateName || 'Historical Submission'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Matching Regions
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                {currentMatch?.matchingRegionsCount || 0}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Largest Matching Region
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                {currentMatch?.largestMatchingRegion || 0} lines
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              color: '#d97706',
              fontSize: '0.6875rem',
              fontWeight: 600,
              maxWidth: 320,
            }}
          >
            Human review recommended. Do NOT automatically accuse of plagiarism based solely on similarity signal.
          </div>
        </div>

        {/* Side-by-Side Code Viewer */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
          {/* Left: Candidate Submission */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              background: '#0d1117',
              color: '#e6edf3',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '8px 14px',
                background: '#161b22',
                borderBottom: '1px solid #30363d',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#58a6ff',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileCode size={14} />
              <span>Candidate Submission ({analysis.language})</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
              {candidateLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isMatched = currentMatch?.matchedLines?.includes(lineNum);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      background: isMatched ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                      borderLeft: isMatched ? '3px solid #ea580c' : '3px solid transparent',
                      paddingLeft: 4,
                    }}
                  >
                    <span style={{ width: 36, color: '#484f58', userSelect: 'none', textAlign: 'right', paddingRight: 12, flexShrink: 0 }}>
                      {lineNum}
                    </span>
                    <span style={{ whiteSpace: 'pre', color: isMatched ? '#ffdcd7' : '#c9d1d9' }}>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Similar Peer Submission */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: '#0d1117',
              color: '#e6edf3',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '8px 14px',
                background: '#161b22',
                borderBottom: '1px solid #30363d',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#f0883e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileCode size={14} />
                <span>{currentMatch?.candidateName || 'Comparison Reference'} ({currentMatch?.similarity || 0}% match)</span>
              </div>
              {matchedList.length > 1 && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {matchedList.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMatchIdx(idx)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedMatchIdx === idx ? '#f0883e' : '#30363d',
                        background: selectedMatchIdx === idx ? '#f0883e20' : 'transparent',
                        color: selectedMatchIdx === idx ? '#f0883e' : '#8b949e',
                        cursor: 'pointer',
                      }}
                    >
                      Peer #{idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
              {matchedLines.map((line, idx) => {
                const lineNum = idx + 1;
                return (
                  <div key={idx} style={{ display: 'flex', paddingLeft: 4 }}>
                    <span style={{ width: 36, color: '#484f58', userSelect: 'none', textAlign: 'right', paddingRight: 12, flexShrink: 0 }}>
                      {lineNum}
                    </span>
                    <span style={{ whiteSpace: 'pre', color: '#c9d1d9' }}>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviewer Audit Action Drawer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Add reviewer audit rationale (e.g. Standard boilerplate structure; independent logic verified)..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {savedDecision ? (
              <span style={{ color: '#059669', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={16} /> Audit Saved: {savedDecision}
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleDecision('VERIFIED')}
                  disabled={updating}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Check size={14} />
                  <span>Verify Originality</span>
                </button>

                <button
                  onClick={() => handleDecision('NEEDS_REVIEW')}
                  disabled={updating}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'rgba(217, 119, 6, 0.1)',
                    color: '#d97706',
                    border: '1px solid rgba(217, 119, 6, 0.3)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>Flag for Defense Review</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
