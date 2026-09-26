import { apiRequest } from '../../../lib/api';

export const proofGraphService = {
  getProofGraph: (candidateId?: string) =>
    apiRequest(`/proofgraph${candidateId ? `/${candidateId}` : ''}`),
};
