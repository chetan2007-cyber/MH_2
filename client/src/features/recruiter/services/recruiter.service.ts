import { apiRequest } from '../../../lib/api';

export const recruiterService = {
  discoverCandidates: (params?: string) =>
    apiRequest(`/recruiters/discover${params ? `?${params}` : ''}`),

  getCandidateDossier: (candidateId: string) =>
    apiRequest(`/recruiters/candidate/${candidateId}`),

  toggleSaveCandidate: (candidateId: string) =>
    apiRequest(`/recruiters/candidate/${candidateId}/toggle-save`, { method: 'POST' }),
};
