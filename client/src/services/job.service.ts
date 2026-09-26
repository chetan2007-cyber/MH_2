import { api } from '../lib/api';
import type { Job, CompetencyItem } from '../types/api';

export interface CreateJobInput {
  title: string;
  department: string;
  careerDomain: string;
  branch?: string;
  profession: string;
  experience: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location?: string;
  description: string;
  requiredSkills?: string[];
  optionalSkills?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  assessmentDurationMinutes?: number;
}

export const jobService = {
  async listJobs(filters?: { careerDomain?: string; profession?: string; department?: string; status?: string; search?: string }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.careerDomain) params.append('careerDomain', filters.careerDomain);
    if (filters?.profession) params.append('profession', filters.profession);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get<Job[]>(`/jobs${queryStr}`);
    return res.data || [];
  },

  async getJobById(jobId: string): Promise<Job> {
    const res = await api.get<Job>(`/jobs/${jobId}`);
    if (!res.data) throw new Error(res.error || 'Job not found');
    return res.data;
  },

  async createJob(input: CreateJobInput): Promise<Job> {
    const res = await api.post<Job>('/jobs', input);
    if (!res.data) throw new Error(res.error || 'Failed to create job requisition');
    return res.data;
  },

  async generateJobDNA(jobId: string): Promise<Job> {
    const res = await api.post<Job>(`/jobs/${jobId}/analyze`, {});
    if (!res.data) throw new Error(res.error || 'Failed to generate Job DNA');
    return res.data;
  },

  async updateCompetencies(jobId: string, competencies: CompetencyItem[]): Promise<Job> {
    const res = await api.patch<Job>(`/jobs/${jobId}/competencies`, { competencies });
    if (!res.data) throw new Error(res.error || 'Failed to update competencies');
    return res.data;
  },

  async updateStatus(jobId: string, status: string): Promise<Job> {
    const res = await api.patch<Job>(`/jobs/${jobId}/status`, { status });
    if (!res.data) throw new Error(res.error || 'Failed to update job status');
    return res.data;
  },
};
