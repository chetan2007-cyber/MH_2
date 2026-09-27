import { api } from '../lib/api';
import type { Assessment, RubricCriterion, AssessmentDependencyInfo } from '../types/api';

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

  async getAssessmentDependencies(id: string): Promise<AssessmentDependencyInfo> {
    const res = await api.get<{ success: boolean; data: AssessmentDependencyInfo }>(`/assessments/${id}/dependencies`);
    if (!res.data) throw new Error(res.error || 'Failed to fetch assessment dependencies');
    return (res.data as any).data || res.data;
  },

  async deleteAssessment(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/assessments/${id}`);
    if (!res.success && res.error) throw new Error(res.error);
    return res as any;
  },

  async archiveAssessment(id: string, reason?: string): Promise<{ success: boolean; assessment: Assessment; message: string }> {
    const res = await api.patch<{ success: boolean; assessment: Assessment; message: string }>(`/assessments/${id}/archive`, { reason });
    if (!res.success && res.error) throw new Error(res.error);
    return res as any;
  },
};
