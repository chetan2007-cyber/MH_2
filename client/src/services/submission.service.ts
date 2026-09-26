import { apiClient } from '../lib/api';
import type { Submission, ApiResponse } from '../types/api';

export const submissionService = {
  async getSubmissions(params?: { status?: string; domain?: string; role?: string }): Promise<ApiResponse<Submission[]>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.domain && params.domain !== 'All') query.append('domain', params.domain);
    if (params?.role) query.append('role', params.role);

    const qs = query.toString();
    return apiClient.get<Submission[]>(`/submissions${qs ? `?${qs}` : ''}`);
  },

  async getSubmissionById(id: string): Promise<ApiResponse<Submission>> {
    return apiClient.get<Submission>(`/submissions/${id}`);
  },

  async getMySubmissions(): Promise<ApiResponse<Submission[]>> {
    return apiClient.get<Submission[]>('/submissions/me');
  },

  async createSubmission(challengeId: string): Promise<ApiResponse<Submission>> {
    return apiClient.post<Submission>('/submissions', { challengeId });
  },

  async updateSubmission(id: string, updates: Partial<Submission>): Promise<ApiResponse<Submission>> {
    return apiClient.patch<Submission>(`/submissions/${id}`, updates);
  },

  async submitForReview(id: string, payload: { deliverables: any[]; adrs?: any[] }): Promise<ApiResponse<Submission>> {
    return apiClient.post<Submission>(`/submissions/${id}/submit`, payload);
  },

  async runWorkspaceTests(submissionId: string): Promise<ApiResponse<{ passed: number; total: number; logs: string[] }>> {
    return apiClient.post(`/submissions/${submissionId}/run-tests`);
  },
};
