import { apiRequest } from '../../../lib/api';

export const reviewService = {
  getReviewQueue: () =>
    apiRequest('/reviews/queue'),

  getReviewDossier: (id: string) =>
    apiRequest(`/reviews/dossier/${id}`),

  submitReview: (id: string, body: any) =>
    apiRequest(`/reviews/${id}/evaluate`, { method: 'POST', body: JSON.stringify(body) }),
};
