import { apiClient } from '../lib/api';
import type { CandidateCapabilitiesResponse, ApiResponse } from '../types/api';

export const capabilityService = {
  async getUserCapabilities(userId?: string): Promise<ApiResponse<CandidateCapabilitiesResponse>> {
    const endpoint = userId ? `/users/${userId}/capabilities` : '/users/me/capabilities';
    return apiClient.get<CandidateCapabilitiesResponse>(endpoint);
  },
};
