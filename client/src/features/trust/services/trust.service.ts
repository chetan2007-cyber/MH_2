import { apiRequest } from '../../../lib/api';

export const trustService = {
  getTrustSignals: (candidateId?: string) =>
    apiRequest(`/trust${candidateId ? `/${candidateId}` : ''}`),
};
