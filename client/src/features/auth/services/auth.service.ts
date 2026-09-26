import { apiRequest } from '../../../lib/api';

export const authService = {
  registerCandidate: (body: any) =>
    apiRequest('/auth/register/candidate', { method: 'POST', body: JSON.stringify(body) }),

  registerReviewer: (body: any) =>
    apiRequest('/auth/register/reviewer', { method: 'POST', body: JSON.stringify(body) }),

  registerRecruiter: (body: any) =>
    apiRequest('/auth/register/recruiter', { method: 'POST', body: JSON.stringify(body) }),

  verifyEmail: (token: string) =>
    apiRequest('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),

  login: (body: any) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () =>
    apiRequest('/auth/me'),

  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),

  logoutAll: () =>
    apiRequest('/auth/logout-all', { method: 'POST' }),

  getSessions: () =>
    apiRequest('/auth/sessions'),

  revokeSession: (id: string) =>
    apiRequest(`/auth/sessions/${id}`, { method: 'DELETE' }),

  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (body: any) =>
    apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};
