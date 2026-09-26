import { apiRequest } from '../../../lib/api';

export const candidateService = {
  getCapabilities: (candidateId?: string) =>
    apiRequest(`/capabilities${candidateId ? `/${candidateId}` : ''}`),

  getScoreExplanation: (candidateId: string, dimension: string) =>
    apiRequest(`/capabilities/${candidateId}/explain/${dimension}`),
};
