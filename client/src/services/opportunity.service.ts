import { apiClient } from '../lib/api';
import type { Opportunity, ApiResponse } from '../types/api';

export const opportunityService = {
  async getOpportunities(): Promise<ApiResponse<Opportunity[]>> {
    return apiClient.get<Opportunity[]>('/opportunities');
  },

  async sendOpportunity(payload: {
    candidateId: string;
    roleTitle: string;
    message: string;
    compensationRange?: string;
  }): Promise<ApiResponse<Opportunity>> {
    return apiClient.post<Opportunity>('/opportunities', payload);
  },

  async updateOpportunityStatus(id: string, status: 'ACCEPTED' | 'DECLINED'): Promise<ApiResponse<Opportunity>> {
    return apiClient.patch<Opportunity>(`/opportunities/${id}`, { status });
  },
};
