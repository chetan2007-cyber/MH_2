import { api } from '../lib/api';
import type { Assessment, RubricCriterion } from '../types/api';

export interface UpdateAssessmentInput {
  title?: string;
  scenario?: string;
  practicalTask?: string;
  constraints?: string[];
  deliverables?: string[];
  toolsAllowed?: string[];
  rubricCriteria?: RubricCriterion[];
  timeLimitMinutes?: number;
  changeNotes?: string;
}

export const assessmentService = {
  async generateAssessment(jobId: string): Promise<Assessment> {
    const res = await api.post<Assessment>('/assessments/generate', { jobId });
    if (!res.data) throw new Error(res.error || 'Failed to generate assessment');
    return res.data;
  },

  async getAssessmentsByJob(jobId: string): Promise<Assessment[]> {
    const res = await api.get<Assessment[]>(`/assessments/job/${jobId}`);
    return res.data || [];
  },

  async getAssessmentById(id: string): Promise<Assessment> {
    const res = await api.get<Assessment>(`/assessments/${id}`);
    if (!res.data) throw new Error(res.error || 'Assessment not found');
    return res.data;
  },

  async updateAssessment(id: string, input: UpdateAssessmentInput): Promise<Assessment> {
    const res = await api.patch<Assessment>(`/assessments/${id}`, input);
    if (!res.data) throw new Error(res.error || 'Failed to update assessment');
    return res.data;
  },

  async publishAssessment(id: string): Promise<Assessment> {
    const res = await api.post<Assessment>(`/assessments/${id}/publish`, {});
    if (!res.data) throw new Error(res.error || 'Failed to publish assessment');
    return res.data;
  },
};
