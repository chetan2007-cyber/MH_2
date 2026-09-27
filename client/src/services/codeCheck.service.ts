import { api } from '../lib/api';

export interface CodeDimensionBreakdown {
  correctness: number;
  readability: number;
  maintainability: number;
  complexity: number;
  security: number;
  performance: number;
  codeStyle: number;
  errorHandling: number;
  documentation: number;
}

export interface SecurityFinding {
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  rule: string;
  message: string;
  line: number;
}

export interface MatchedSubmission {
  submissionId: string;
  candidateId: string;
  candidateName: string;
  similarity: number;
  isReferenceSolution: boolean;
  matchedLines: number[];
  matchingRegionsCount: number;
  largestMatchingRegion: number;
  sampleMatch: string;
  similarSnippet?: string;
}

export interface CodeAnalysisResult {
  _id: string;
  candidateId?: string;
  submissionId?: string;
  assessmentId?: string;
  jobId?: string;
  challengeId?: string;
  language: string;
  codeSnippet: string;
  qualityScore: number;
  qualityStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'HIGH_RISK';
  dimensions: CodeDimensionBreakdown;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  testResults: {
    passed: number;
    total: number;
    status: 'PASSED' | 'FAILED' | 'PARTIAL' | 'NOT_CONFIGURED';
    details: Array<{
      name: string;
      status: 'PASSED' | 'FAILED' | 'ERROR';
      message: string;
      durationMs: number;
    }>;
  };
  securityFindings: SecurityFinding[];
  similarityScore: number;
  similarityStatus: 'LOW' | 'MEDIUM' | 'HIGH';
  matchedSubmissions: MatchedSubmission[];
  integrityStatus: 'VERIFIED' | 'REVIEW_RECOMMENDED';
  reviewerVerification?: {
    decision: 'VERIFIED' | 'NEEDS_REVIEW' | 'NOT_VERIFIED' | 'PENDING';
    notes?: string;
    reviewedAt?: string;
  };
  analyzedAt: string;
}

export interface AnalyzeCodeInput {
  code: string;
  language: string;
  assessmentId?: string;
  candidateId?: string;
  submissionId?: string;
  jobId?: string;
  challengeId?: string;
}

export const codeCheckService = {
  async analyzeCode(input: AnalyzeCodeInput): Promise<CodeAnalysisResult> {
    const res = await api.post<{ success: boolean; data: CodeAnalysisResult }>('/code-check/analyze', input);
    if (res.error) throw new Error(res.error);
    const result = (res.data as any)?.data || res.data;
    return result as CodeAnalysisResult;
  },

  async getLatestAnalysis(params: {
    submissionId?: string;
    assessmentId?: string;
    candidateId?: string;
    jobId?: string;
  }): Promise<CodeAnalysisResult | null> {
    const searchParams = new URLSearchParams();
    if (params.submissionId) searchParams.append('submissionId', params.submissionId);
    if (params.assessmentId) searchParams.append('assessmentId', params.assessmentId);
    if (params.candidateId) searchParams.append('candidateId', params.candidateId);
    if (params.jobId) searchParams.append('jobId', params.jobId);

    const qs = searchParams.toString();
    const endpoint = `/code-check/latest${qs ? `?${qs}` : ''}`;
    const res = await api.get<{ success: boolean; data: CodeAnalysisResult }>(endpoint);
    if (res.error) return null;
    const result = (res.data as any)?.data || res.data;
    return (result || null) as CodeAnalysisResult | null;
  },

  async getAnalysisById(id: string): Promise<CodeAnalysisResult> {
    const res = await api.get<{ success: boolean; data: CodeAnalysisResult }>(`/code-check/${id}`);
    if (res.error) throw new Error(res.error);
    const result = (res.data as any)?.data || res.data;
    return result as CodeAnalysisResult;
  },

  async getComparisonDetails(analysisId: string, matchIndex = 0) {
    const res = await api.get<any>(`/code-check/comparison/${analysisId}?matchIndex=${matchIndex}`);
    if (res.error) throw new Error(res.error);
    return (res.data as any)?.data || res.data;
  },

  async verifyIntegrity(input: {
    analysisId: string;
    decision: 'VERIFIED' | 'NEEDS_REVIEW' | 'NOT_VERIFIED';
    notes?: string;
  }): Promise<CodeAnalysisResult> {
    const res = await api.post<{ success: boolean; data: CodeAnalysisResult }>('/code-check/verify', input);
    if (res.error) throw new Error(res.error);
    const result = (res.data as any)?.data || res.data;
    return result as CodeAnalysisResult;
  },
};
