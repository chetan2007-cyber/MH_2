import { apiRequest } from '../../../lib/api';

export const workspaceService = {
  getSubmissionWorkspace: (id: string) =>
    apiRequest(`/submissions/${id}`),

  saveArchitecture: (id: string, body: any) =>
    apiRequest(`/submissions/${id}/architecture`, { method: 'POST', body: JSON.stringify(body) }),

  saveADR: (id: string, body: any) =>
    apiRequest(`/submissions/${id}/adrs`, { method: 'POST', body: JSON.stringify(body) }),

  deleteADR: (submissionId: string, adrId: string) =>
    apiRequest(`/submissions/${submissionId}/adrs/${adrId}`, { method: 'DELETE' }),

  triggerVerification: (id: string) =>
    apiRequest(`/submissions/${id}/verify`, { method: 'POST' }),

  finalizeSubmission: (id: string) =>
    apiRequest(`/submissions/${id}/finalize`, { method: 'POST' }),

  getDefenseRound: (id: string) =>
    apiRequest(`/defense/${id}`),

  submitDefense: (id: string, answers: any[]) =>
    apiRequest(`/defense/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
};
