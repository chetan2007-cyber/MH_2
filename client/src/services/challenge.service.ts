import { apiClient } from '../lib/api';
import type { Challenge, ChallengeFilter, ApiResponse } from '../types/api';

export const challengeService = {
  async getChallenges(filters?: ChallengeFilter): Promise<ApiResponse<Challenge[]>> {
    const params = new URLSearchParams();
    if (filters?.domain && filters.domain !== 'All') params.append('domain', filters.domain);
    if (filters?.profession) params.append('profession', filters.profession);
    if (filters?.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const qs = params.toString();
    const endpoint = `/challenges${qs ? `?${qs}` : ''}`;
    return apiClient.get<Challenge[]>(endpoint);
  },

  async getChallengeById(id: string): Promise<ApiResponse<Challenge>> {
    return apiClient.get<Challenge>(`/challenges/${id}`);
  },

  async getChallengesByProfession(profession: string): Promise<ApiResponse<Challenge[]>> {
    return apiClient.get<Challenge[]>(`/challenges?profession=${encodeURIComponent(profession)}`);
  },
};
