import { apiClient } from '../lib/api';
import type { ProofGraphData, ApiResponse } from '../types/api';

export const proofGraphService = {
  async getProofGraph(userId?: string): Promise<ApiResponse<ProofGraphData>> {
    const endpoint = userId ? `/users/${userId}/proof-graph` : '/users/me/proof-graph';
    return apiClient.get<ProofGraphData>(endpoint);
  },
};
