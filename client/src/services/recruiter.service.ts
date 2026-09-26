import { apiClient } from '../lib/api';
import type { CandidateProfile, CandidateFilter, ApiResponse } from '../types/api';

export const recruiterService = {
  async searchCandidates(filters?: CandidateFilter): Promise<ApiResponse<CandidateProfile[]>> {
    const params = new URLSearchParams();
    if (filters?.domain && filters.domain !== 'All') params.append('domain', filters.domain);
    if (filters?.profession) params.append('profession', filters.profession);
    if (filters?.capability) params.append('capability', filters.capability);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minProofScore) params.append('minScore', String(filters.minProofScore));

    const qs = params.toString();
    return apiClient.get<CandidateProfile[]>(`/candidates${qs ? `?${qs}` : ''}`);
  },

  async getCandidateById(id: string): Promise<ApiResponse<CandidateProfile>> {
    return apiClient.get<CandidateProfile>(`/candidates/${id}`);
  },

  async compareCandidates(candidateIds: string[]): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/candidates/compare', { candidateIds });
  },
};
