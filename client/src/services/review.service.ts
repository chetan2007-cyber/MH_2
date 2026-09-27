import { apiClient } from '../lib/api';
import type { Review, ApiResponse } from '../types/api';

export const reviewService = {
  async getReviewQueue(domain?: string): Promise<ApiResponse<any[]>> {
    const qs = domain && domain !== 'All' ? `?domain=${encodeURIComponent(domain)}` : '';
    return apiClient.get<any[]>(`/reviews/queue${qs}`);
  },

  async getReviewById(id: string): Promise<ApiResponse<Review>> {
    return apiClient.get<Review>(`/reviews/${id}`);
  },

  async submitReview(payload: {
    submissionId: string;
    scores: Array<{ criterionId: string; score: number; maxScore: number; notes?: string }>;
    decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
    summaryFeedback: string;
    defenseRecommendation?: string;
  }): Promise<ApiResponse<Review>> {
    return apiClient.post<Review>('/reviews', payload);
  },

  async submitDefenseAudit(submissionId: string, payload: {
    passed: boolean;
    confidenceScore: number;
    transcriptNotes: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post(`/reviews/${submissionId}/defense`, payload);
  },

  async saveReviewDraft(submissionId: string, payload: {
    scores?: Array<{ criterionId: string; score: number; maxScore: number; notes?: string }>;
    decision?: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
    summaryFeedback?: string;
    defenseRecommendation?: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post(`/reviews/dossier/${submissionId}/draft`, payload);
  },

  async getReviewDraft(submissionId: string): Promise<ApiResponse<{ draft: any }>> {
    return apiClient.get<{ draft: any }>(`/reviews/dossier/${submissionId}/draft`);
  },

  async deleteReviewDraft(submissionId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/reviews/dossier/${submissionId}/draft`);
  },

  async withdrawReview(submissionId: string, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/reviews/dossier/${submissionId}/withdraw`, { reason });
  },
};
