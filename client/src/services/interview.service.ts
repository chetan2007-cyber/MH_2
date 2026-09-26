import { api } from '../lib/api';
import type { Interview, GeneratedInterviewQuestion, ScorecardCriterion } from '../types/api';

export interface GeneratedQuestionsResponse {
  applicationId: string;
  candidate: { id: string; name: string; profession: string };
  job: { id: string; title: string; department: string };
  questions: GeneratedInterviewQuestion[];
}

export interface ScheduleInterviewInput {
  applicationId: string;
  scheduledAt?: string;
  durationMinutes?: number;
  questions?: GeneratedInterviewQuestion[];
}

export interface SubmitScorecardInput {
  scorecard: ScorecardCriterion[];
  interviewerNotes?: string;
  recommendation: 'STRONG_YES' | 'YES' | 'NEUTRAL' | 'NO' | 'STRONG_NO';
}

export const interviewService = {
  async generateQuestions(applicationId: string): Promise<GeneratedQuestionsResponse> {
    const res = await api.get<GeneratedQuestionsResponse>(`/interviews/questions/${applicationId}`);
    if (!res.data) throw new Error(res.error || 'Failed to generate interview questions');
    return res.data;
  },

  async scheduleInterview(input: ScheduleInterviewInput): Promise<Interview> {
    const res = await api.post<Interview>('/interviews/schedule', input);
    if (!res.data) throw new Error(res.error || 'Failed to schedule interview');
    return res.data;
  },

  async getInterviewByApplication(applicationId: string): Promise<Interview | null> {
    const res = await api.get<Interview>(`/interviews/application/${applicationId}`);
    return res.data || null;
  },

  async submitScorecard(interviewId: string, input: SubmitScorecardInput): Promise<Interview> {
    const res = await api.post<Interview>(`/interviews/${interviewId}/scorecard`, input);
    if (!res.data) throw new Error(res.error || 'Failed to save interview scorecard');
    return res.data;
  },
};
