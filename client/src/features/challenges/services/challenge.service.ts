import { apiRequest } from '../../../lib/api';

export const challengeService = {
  getChallenges: (params?: string) =>
    apiRequest(`/challenges${params ? `?${params}` : ''}`),

  getChallengeBySlug: (slug: string) =>
    apiRequest(`/challenges/${slug}`),

  startChallenge: (id: string) =>
    apiRequest(`/challenges/${id}/start`, { method: 'POST' }),
};
