import { apiRequest } from '../../../lib/api';

export const passportService = {
  getMyPassport: () =>
    apiRequest('/passport/me'),

  generateProofToken: () =>
    apiRequest('/passport/token/generate', { method: 'POST' }),

  revokeProofToken: () =>
    apiRequest('/passport/token/revoke', { method: 'POST' }),

  getPublicProof: (token: string) =>
    apiRequest(`/public/proof/${token}`),
};
