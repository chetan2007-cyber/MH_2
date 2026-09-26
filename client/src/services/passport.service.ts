import { apiClient } from '../lib/api';
import type { ProofPassportData, ApiResponse } from '../types/api';

export const passportService = {
  async getPassport(userId?: string): Promise<ApiResponse<ProofPassportData>> {
    const endpoint = userId ? `/users/${userId}/proof-passport` : '/users/me/proof-passport';
    return apiClient.get<ProofPassportData>(endpoint);
  },

  async verifyPublicPassport(token: string): Promise<ApiResponse<ProofPassportData>> {
    return apiClient.get<ProofPassportData>(`/public/proof/${token}`);
  },

  async createPublicShareToken(): Promise<ApiResponse<{ token: string; shareUrl: string }>> {
    return apiClient.post<{ token: string; shareUrl: string }>('/users/me/proof-passport/share');
  },
};
