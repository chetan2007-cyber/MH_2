// Centralized API facade aggregating all backend services and contract endpoints
export * from './lib/api';
export * from './services';
export * from './types/api';

import { authService } from './services/auth.service';
import { challengeService } from './services/challenge.service';
import { submissionService } from './services/submission.service';
import { reviewService } from './services/review.service';
import { capabilityService } from './services/capability.service';
import { proofGraphService } from './services/proofgraph.service';
import { passportService } from './services/passport.service';
import { recruiterService } from './services/recruiter.service';
import { opportunityService } from './services/opportunity.service';
import { notificationService } from './services/notification.service';
import { apiClient } from './lib/api';

export const api = {
  ...authService,
  ...challengeService,
  ...submissionService,
  ...reviewService,
  ...capabilityService,
  ...proofGraphService,
  ...passportService,
  ...recruiterService,
  ...opportunityService,
  ...notificationService,

  // Role-specific Registration Aliases
  registerCandidate: (data: any) => authService.register({ ...data, role: 'CANDIDATE' }),
  registerReviewer: (data: any) => authService.register({ ...data, role: 'REVIEWER' }),
  registerRecruiter: (data: any) => authService.register({ ...data, role: 'RECRUITER' }),
  verifyEmail: (token: string) => apiClient.post<any>('/auth/verify-email', { token }),

  // Capability & Passport Aliases
  getCapabilities: (userId?: string) => capabilityService.getUserCapabilities(userId),
  getMyPassport: () => passportService.getPassport(),
  getPublicProof: (token: string) => passportService.verifyPublicPassport(token),
  generateProofToken: () => passportService.createPublicShareToken(),
  revokeProofToken: () => apiClient.delete<any>('/users/me/proof-passport/share'),

  // Workspace & Submission Aliases
  startChallenge: (challengeId: string) => submissionService.createSubmission(challengeId),
  getSubmissionWorkspace: (id: string) => submissionService.getSubmissionById(id),
  saveArchitecture: (id: string, payload: any) => submissionService.updateSubmission(id, { metrics: payload }),
  saveADR: (id: string, adr: any) => apiClient.post<any>(`/submissions/${id}/adrs`, adr),
  triggerVerification: (id: string) => submissionService.runWorkspaceTests(id),
  submitDefense: (id: string, transcript: any) => apiClient.post<any>(`/submissions/${id}/defense`, { answers: Array.isArray(transcript) ? transcript : [transcript] }),
  finalizeSubmission: (id: string, payload?: any) => submissionService.submitForReview(id, payload || { deliverables: [] }),

  // Opportunities & Trust Aliases
  respondOpportunity: (id: string, status: any, notes?: string) => opportunityService.updateOpportunityStatus(id, status),
  getTrustSignals: (_scope?: any) => apiClient.get<any>('/trust/signals'),
  getSessions: () => authService.getActiveSessions(),
  logoutAll: () => apiClient.post<any>('/auth/logout-all'),

  // Admin Aliases
  getAdminOverview: () => apiClient.get<any>('/admin/overview'),
  getAdminUsers: (filters?: any) => apiClient.get<any>('/admin/users'),
  getAuditLogs: (filters?: any) => apiClient.get<any>('/admin/audit-logs'),
  toggleUserStatus: (userId: string, active?: boolean) => apiClient.patch<any>(`/admin/users/${userId}/status`, { active }),
};
