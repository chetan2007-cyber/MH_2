import React from 'react';
import {
  Dna, X, CheckCircle2, Shield, Cpu, Layers, Sparkles,
  BarChart2, Clock, Award, Briefcase, ChevronRight, FileText
} from 'lucide-react';
import type { Job } from '../../types/api';

interface JobDNAInspectorModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDNAInspectorModal: React.FC<JobDNAInspectorModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !job) return null;

  const jobDNA = job.jobDNA;
  const competencies = job.competencies || [];
  const hasDNA = !!jobDNA;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              <Dna size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#059669',
                    background: 'rgba(5, 150, 105, 0.12)',
                    padding: '2px 8px',
                    borderRadius: 99,
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                  }}
                >
                  Recruiter Job DNA Blueprint
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {job.department} · {job.careerDomain}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: job.status === 'OPEN' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-surface)',
                    color: job.status === 'OPEN' ? '#059669' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {job.status}
                </span>
              </div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {job.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 8,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Job Overview / Description */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              borderRadius: 14,
              padding: '1.25rem 1.5rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              Requisition Description & Core Scope
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {job.description}
            </p>
          </div>

          {/* Key Dimensions Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Target Experience
              </div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  marginTop: 4,
                }}
              >
                {job.experience}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Target Difficulty
              </div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  color: '#4f46e5',
                  marginTop: 4,
                }}
              >
                {job.difficulty}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Assessment Duration
              </div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  marginTop: 4,
                }}
              >
                {job.assessmentDurationMinutes || 60} mins
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Employment / Location
              </div>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {job.employmentType}
              </div>
            </div>
          </div>

          {/* Job DNA Synthesized Dimensions */}
          {hasDNA ? (
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 14,
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} color="#059669" />
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      margin: 0,
                    }}
                  >
                    Synthesized Job DNA Dimensions
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <CheckCircle2 size={14} /> AI Calibrated & Active
                </span>
              </div>

              {/* Mandatory Requirements */}
              {jobDNA?.mandatoryRequirements && jobDNA.mandatoryRequirements.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    Mandatory Proof Criteria (Reviewer Benchmark)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {jobDNA.mandatoryRequirements.map((req, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: 'var(--bg-subtle)',
                          padding: '8px 12px',
                          borderRadius: 8,
                        }}
                      >
                        <Shield size={14} color="#059669" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills & Problem Solving Focus */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.25rem',
                  marginTop: '1rem',
                }}
              >
                {/* Technical Skills */}
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    Required Technical Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {jobDNA?.technicalSkills && jobDNA.technicalSkills.length > 0 ? (
                      jobDNA.technicalSkills.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: 'rgba(79, 70, 229, 0.1)',
                            color: '#4f46e5',
                            border: '1px solid rgba(79, 70, 229, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>{s.name}</span>
                          <span
                            style={{
                              fontSize: '0.625rem',
                              opacity: 0.75,
                              textTransform: 'uppercase',
                            }}
                          >
                            ({s.importance})
                          </span>
                        </span>
                      ))
                    ) : (
                      (job.requiredSkills || []).map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: 'rgba(79, 70, 229, 0.1)',
                            color: '#4f46e5',
                          }}
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Problem Solving Focus */}
                {jobDNA?.problemSolvingFocus && jobDNA.problemSolvingFocus.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-secondary)',
                        marginBottom: 8,
                      }}
                    >
                      Problem-Solving Focus Dimensions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {jobDNA.problemSolvingFocus.map((ps, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: 'var(--bg-subtle)',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                            {ps.dimension}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800,
                              color: 'var(--accent-primary)',
                            }}
                          >
                            {ps.weight}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: 14,
                background: 'var(--bg-subtle)',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <Dna size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Job DNA Not Synthesized Yet
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                The recruiter has created this requisition, but the AI Job DNA synthesis has not been triggered yet.
              </p>
            </div>
          )}

          {/* Competency Model & Rubric Weights Blueprint */}
          {competencies.length > 0 && (
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 14,
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      margin: 0,
                    }}
                  >
                    Competency Weights & Rubric Blueprint
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      margin: '2px 0 0',
                    }}
                  >
                    Recruiter calibrated evaluation dimensions for peer reviewer scoring.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: '#059669',
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(5, 150, 105, 0.1)',
                  }}
                >
                  100% Calibrated
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {competencies.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                          }}
                        >
                          {comp.name}
                        </span>
                        {comp.proficiencyLevel && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: 'var(--bg-surface)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {comp.proficiencyLevel}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 900,
                          fontFamily: 'var(--font-mono)',
                          color: '#059669',
                        }}
                      >
                        {comp.weight}%
                      </span>
                    </div>

                    <div
                      style={{
                        height: 6,
                        background: 'var(--bg-surface)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        marginBottom: comp.description ? 6 : 0,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${comp.weight}%`,
                          background: 'linear-gradient(90deg, #059669, #10b981)',
                          borderRadius: 3,
                        }}
                      />
                    </div>

                    {comp.description && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {comp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              background: 'var(--text-main)',
              color: '#fff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
