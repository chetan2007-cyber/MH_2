import { apiRequest } from '../../../lib/api';

export const opportunityService = {
  sendOpportunity: (body: any) =>
    apiRequest('/opportunities/send', { method: 'POST', body: JSON.stringify(body) }),

  getOpportunities: () =>
    apiRequest('/opportunities'),

  respondOpportunity: (id: string, status: string, notes?: string) =>
    apiRequest(`/opportunities/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ status, candidateResponseNotes: notes }),
    }),
};
