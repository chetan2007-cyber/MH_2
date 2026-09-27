import { api } from '../lib/api';
import type { Application } from '../types/api';

export interface SubmitAttemptInput {
  assessmentId?: string;
  workUrl?: string;
  notes?: string;
  adrDecision?: string;
  modalityType?: string;
  artifactData?: any;
  durationMinutes?: number;
}

export interface FinalDecisionInput {
  decision: 'SELECT' | 'HOLD' | 'REJECT';
  reason?: string;
}

export const applicationService = {
  async applyToJob(jobId: string): Promise<Application> {
    const res = await api.post<Application>('/applications', { jobId });
    if (!res.data) throw new Error(res.error || 'Failed to apply to job');
    return res.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await api.get<Application[]>('/applications/my');
    return res.data || [];
  },

  async getApplicationsByJob(jobId: string, filters?: { status?: string; isShortlisted?: boolean }): Promise<Application[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.isShortlisted !== undefined) params.append('isShortlisted', String(filters.isShortlisted));

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get<Application[]>(`/applications/job/${jobId}${queryStr}`);
    return res.data || [];
  },

  async getApplicationById(id: string): Promise<Application> {
    const res = await api.get<Application>(`/applications/${id}`);
    if (!res.data) throw new Error(res.error || 'Application not found');
    return res.data;
  },

  async getAssessmentStatsByJob(jobId: string): Promise<{ totalApplications: number; assignedCount: number; completedCount: number; pendingCount: number }> {
    const res = await api.get<{ totalApplications: number; assignedCount: number; completedCount: number; pendingCount: number }>(`/applications/job/${jobId}/stats`);
    return res.data || { totalApplications: 0, assignedCount: 0, completedCount: 0, pendingCount: 0 };
  },

  async startAssessmentAttempt(id: string): Promise<{ applicationId: string; status: string; assessment: any; attempt: { startedAt: string; deadline: string; durationMinutes: number; timeRemainingMs: number; isExpired: boolean } }> {
    const res = await api.post<{ applicationId: string; status: string; assessment: any; attempt: { startedAt: string; deadline: string; durationMinutes: number; timeRemainingMs: number; isExpired: boolean } }>(`/applications/${id}/start-assessment`);
    if (!res.data) throw new Error(res.error || 'Failed to start assessment attempt');
    return res.data;
  },

  async getAssessmentForApplication(id: string): Promise<{ applicationId: string; status: string; job: any; assessment: any; attempt: any }> {
    const res = await api.get<{ applicationId: string; status: string; job: any; assessment: any; attempt: any }>(`/applications/${id}/assessment`);
    if (!res.data) throw new Error(res.error || 'Failed to retrieve assessment for application');
    return res.data;
  },

  async submitAssessmentAttempt(id: string, input: SubmitAttemptInput): Promise<Application> {
    const res = await api.post<Application>(`/applications/${id}/submit-attempt`, input);
    if (!res.data) throw new Error(res.error || 'Failed to submit assessment attempt');
    return res.data;
  },

  async submitHumanReview(id: string, reviewData: { status: string; agreedWithAI?: boolean; feedbackNotes?: string; rubricScores?: any }): Promise<Application> {
    const res = await api.post<Application>(`/applications/${id}/review`, reviewData);
    if (!res.data) throw new Error(res.error || 'Failed to submit human review');
    return res.data;
  },

  async makeFinalDecision(id: string, input: FinalDecisionInput): Promise<Application> {
    const res = await api.post<Application>(`/applications/${id}/decision`, input);
    if (!res.data) throw new Error(res.error || 'Failed to save final decision');
    return res.data;
  },

  async assignToCandidate(input: {
    jobId: string;
    candidateId?: string;
    candidateEmail?: string;
    candidateName?: string;
    notes?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const res = await api.post<{ success: boolean; data: any; message: string }>('/applications/assign-candidate', input);
    if (!res.data) throw new Error(res.error || 'Failed to assign assessment to candidate');
    return res.data;
  },
};


