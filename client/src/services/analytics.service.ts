import { api } from '../lib/api';
import type { RecruiterAnalytics } from '../types/api';

export const analyticsService = {
  async getRecruiterAnalytics(): Promise<RecruiterAnalytics> {
    const res = await api.get<RecruiterAnalytics>('/analytics/recruiter');
    if (!res.data) throw new Error(res.error || 'Failed to fetch analytics');
    return res.data;
  },
};
