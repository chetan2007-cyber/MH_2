import React, { useState } from 'react';
import {
  Code2, CheckCircle2, AlertTriangle, Shield, Terminal,
  ChevronDown, ChevronUp, Upload, RefreshCw, Check, Layers, Cpu, FileCode
} from 'lucide-react';
import {
  codeCheckService,
  type CodeAnalysisResult
} from '../../services/codeCheck.service';

interface CodeProofCheckProps {
  assessmentId?: string;
  candidateId?: string;
  submissionId?: string;
  jobId?: string;
  onAnalysisComplete?: (result: CodeAnalysisResult) => void;
  initialCode?: string;
  initialLanguage?: string;
  compact?: boolean;
}

const SUPPORTED_LANGS = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'go', label: 'Go' },
];

export const CodeProofCheck: React.FC<CodeProofCheckProps> = ({
  assessmentId,
  candidateId,
  submissionId,
  jobId,
  onAnalysisComplete,
  initialCode = '',
  initialLanguage = 'javascript',
  compact = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect language from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') setLanguage('javascript');
    else if (ext === 'ts' || ext === 'tsx') setLanguage('typescript');
    else if (ext === 'py') setLanguage('python');
    else if (ext === 'java') setLanguage('java');
    else if (ext === 'c') setLanguage('c');
    else if (ext === 'cpp' || ext === 'cc') setLanguage('cpp');
    else if (ext === 'cs') setLanguage('csharp');
    else if (ext === 'go') setLanguage('go');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setCode(content);
    };
    reader.readAsText(file);
  };

  const handleCheckCode = async () => {
    if (!code.trim()) {
      setError('Please paste your code or upload a file first.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const result = await codeCheckService.analyzeCode({
        code,
        language,
        assessmentId,
        candidateId,
        submissionId,
        jobId,
      });

      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Code analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return '#059669'; // Excellent green
    if (score >= 75) return '#2563eb'; // Good blue
    if (score >= 60) return '#d97706'; // Needs improvement amber
    return '#dc2626'; // High risk red
  };

  const getSimilarityBadge = (score: number) => {
    if (score <= 25) {
      return {
        label: 'Low similarity signal',
        color: '#059669',
        bg: 'rgba(5,150,105,0.1)',
      };
    }
    if (score <= 60) {
      return {
        label: 'Moderate similarity signal',
        color: '#d97706',
        bg: 'rgba(217,119,6,0.1)',
      };
    }
    return {
      label: 'High similarity signal — Review Recommended',
      color: '#ea580c',
      bg: 'rgba(234,88,12,0.12)',
    };
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: compact ? '1rem' : '1.25rem',
        boxShadow: 'var(--shadow-xs)',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'var(--accent-subtle)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
              CODE PROOF CHECK
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Paste your code or upload your source file to evaluate quality, tests, and similarity signal.
            </div>
          </div>
        </div>

        {/* Language selector & Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Language:
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={analyzing}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SUPPORTED_LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: analyzing ? 'not-allowed' : 'pointer',
            }}
          >
            <Upload size={12} />
            <span>Upload</span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".js,.ts,.tsx,.jsx,.py,.java,.c,.cpp,.cs,.go,.txt"
              style={{ display: 'none' }}
              disabled={analyzing}
            />
          </label>
        </div>
      </div>

      {/* Code Editor Box */}
      <div
        style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          background: '#0d1117',
          overflow: 'hidden',
          marginBottom: '0.875rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            fontSize: '0.6875rem',
            color: '#8b949e',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileCode size={13} color="#58a6ff" />
            <span>solution.{language === 'python' ? 'py' : language === 'typescript' ? 'ts' : language === 'java' ? 'java' : language === 'go' ? 'go' : 'js'}</span>
          </div>
          <span>{code.split('\n').length} lines</span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${language} solution code here...\n\nfunction calculateMetrics(data) {\n  // Implementation\n  return data;\n}`}
          rows={compact ? 5 : 7}
          disabled={analyzing}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            color: '#e6edf3',
            border: 'none',
            outline: 'none',
            fontSize: '0.8125rem',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Action / Checking Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: analysis || error ? '1rem' : 0 }}>
        <button
          onClick={handleCheckCode}
          disabled={analyzing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 8,
            background: analyzing ? 'var(--text-muted)' : 'var(--accent-primary)',
            color: '#fff',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: analyzing ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          {analyzing ? (
            <>
              <RefreshCw size={13} className="spin" />
              <span>CHECKING...</span>
            </>
          ) : (
            <>
              <Terminal size={13} />
              <span>{analysis ? 'RE-CHECK CODE' : 'CHECK CODE'}</span>
            </>
          )}
        </button>

        {code && !analyzing && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Code is analyzed in a secure sandboxed environment.
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#dc2626',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
          <button
            onClick={handleCheckCode}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && (
        <div
          style={{
            background: 'var(--bg-subtle)',
            borderRadius: 10,
            border: '1px solid var(--border-subtle)',
            padding: '1rem',
          }}
        >
          {/* Top Score Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '0.875rem',
            }}
          >
            {/* 1. Code Quality */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                CODE QUALITY
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: getQualityColor(analysis.qualityScore),
                  }}
                >
                  {analysis.qualityScore}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: getQualityColor(analysis.qualityScore),
                  marginTop: 2,
                }}
              >
                {analysis.qualityStatus.replace('_', ' ')}
              </div>
            </div>

            {/* 2. Similarity Signal */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                CODE SIMILARITY
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: getSimilarityBadge(analysis.similarityScore).color,
                  }}
                >
                  {analysis.similarityScore}%
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: getSimilarityBadge(analysis.similarityScore).color,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getSimilarityBadge(analysis.similarityScore).label}
              </div>
            </div>

            {/* 3. Hermetic Test Status */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                TEST HARNESS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: analysis.testResults.passed === analysis.testResults.total ? '#059669' : '#d97706',
                  }}
                >
                  {analysis.testResults.passed} / {analysis.testResults.total}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: analysis.testResults.passed === analysis.testResults.total ? '#059669' : '#d97706',
                  marginTop: 2,
                }}
              >
                {analysis.testResults.passed === analysis.testResults.total ? 'All Tests Passed' : 'Partial Execution'}
              </div>
            </div>
          </div>

          {/* Toggle Details Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <span>{showDetails ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expanded Analysis Drawer */}
          {showDetails && (
            <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-subtle)' }}>
              {/* Dimensions Breakdown */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Quality Dimensions Breakdown
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {Object.entries(analysis.dimensions).map(([dim, val]) => (
                    <div
                      key={dim}
                      style={{
                        padding: '6px 8px',
                        background: 'var(--bg-surface)',
                        borderRadius: 6,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {dim}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          color: getQualityColor(val),
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Needs Attention */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
                {/* Strengths */}
                <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>
                    Strengths
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {analysis.strengths.length > 0 ? (
                      analysis.strengths.map((str, idx) => (
                        <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ color: '#059669', flexShrink: 0 }}>✓</span>
                          <span>{str.replace(/^✓\s*/, '')}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard implementation structure.</div>
                    )}
                  </div>
                </div>

                {/* Needs Attention */}
                <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 6 }}>
                    Needs Attention
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {analysis.issues.length > 0 ? (
                      analysis.issues.map((iss, idx) => (
                        <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ color: '#d97706', flexShrink: 0 }}>⚠</span>
                          <span>{iss}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#059669' }}>No critical issues detected.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysis.suggestions.length > 0 && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Recommendations
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {analysis.suggestions.map((rec, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <strong>{idx + 1}.</strong> {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
