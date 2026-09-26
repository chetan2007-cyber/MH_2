import { apiClient, setMemoryToken } from '../lib/api';
import type { User, ApiResponse, AuthResponse } from '../types/api';

export const authService = {
  async register(data: { name: string; email: string; password?: string; role: string; domain?: string; profession?: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.success && res.data?.token) {
      setMemoryToken(res.data.token);
    }
    return res;
  },

  async login(data: { email: string; password?: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.success && res.data?.token) {
      setMemoryToken(res.data.token);
    }
    return res;
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await apiClient.post<null>('/auth/logout');
    setMemoryToken(null);
    return res;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>('/auth/me');
  },

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return apiClient.patch<{ user: User }>('/users/me', updates);
  },

  async getActiveSessions(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/auth/sessions');
  },

  async revokeSession(sessionId: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};
