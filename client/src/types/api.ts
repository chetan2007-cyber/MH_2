// Centralized TypeScript API Contracts and Entity Types for Kaushal Platform
// "Don't claim your skills. Prove them."

export type PlatformRole = 'CANDIDATE' | 'REVIEWER' | 'RECRUITER' | 'ADMIN';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: PlatformRole;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  careerDomain?: string;
  profession?: string;
  skills?: string[];
  proofScore?: number;
  githubUsername?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface Session {
  id: string;
  ipAddress: string;
  device: string;
  location: string;
  current: boolean;
  lastActive: string;
}

export interface Challenge {
  _id: string;
  id?: string;
  title: string;
  tagline: string;
  domainId: string;
  domainName: string;
  profession: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  diffColor?: string;
  effort: string;
  tools: string[];
  proves: string[];
  verifiedByCount: number;
  featured?: boolean;
  progress?: number;
  scenario?: string;
  constraints?: string[];
  deliverables?: string[];
  rubricRef?: string;
  createdAt?: string;
}

export interface ChallengeFilter {
  domain?: string;
  profession?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'DEFENSE_PASSED' | 'REJECTED';

export interface DeliverableFile {
  name: string;
  path: string;
  size: number;
  type: string;
  url?: string;
  content?: string;
}

export interface ADRRecord {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  status: 'ACCEPTED' | 'PROPOSED' | 'SUPERSEDED';
}

export interface Submission {
  _id: string;
  id?: string;
  challengeId: string;
  challengeTitle: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline?: string;
  domainName: string;
  professionName: string;
  status: SubmissionStatus;
  progressPercent: number;
  deliverables: DeliverableFile[];
  adrs: ADRRecord[];
  testSuitesPassed?: number;
  totalTestSuites?: number;
  metrics?: Record<string, any>;
  score?: number;
  defenseStatus?: 'PENDING' | 'SCHEDULED' | 'PASSED' | 'FAILED';
  defenseTranscript?: Array<{ speaker: string; text: string; timestamp?: string }>;
  submittedAt?: string;
  reviewedAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewScore {
  criterionId: string;
  criterionLabel: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface Review {
  _id: string;
  id?: string;
  submissionId: string;
  submissionTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerDomain?: string;
  candidateId: string;
  candidateName: string;
  domainName: string;
  professionName: string;
  scores: ReviewScore[];
  totalScore: number;
  maxPossibleScore: number;
  decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
  summaryFeedback: string;
  defenseRecommendation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CapabilityScore {
  label: string;
  score: number;
  verifiedDeliverablesCount: number;
  expertReviewsCount: number;
  color?: string;
}

export interface CandidateCapabilitiesResponse {
  userId: string;
  proofScore: number;
  verifiedProjectsCount: number;
  expertReviewsCount: number;
  defenseRoundsCount: number;
  capabilities: CapabilityScore[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'EMERGING' | 'INSUFFICIENT_EVIDENCE';
}

export interface ProofGraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'CAPABILITY' | 'PROJECT' | 'ADR' | 'REVIEW' | 'TEST' | 'DEFENSE';
  score?: number;
  x: number;
  y: number;
  color: string;
  evidenceItems: string[];
}

export interface ProofGraphEdge {
  from: string;
  to: string;
}

export interface ProofGraphData {
  userId: string;
  professionName: string;
  nodes: ProofGraphNode[];
  edges: ProofGraphEdge[];
  lastCalculatedAt?: string;
}

export interface VerifiedDeliverable {
  id: string;
  title: string;
  domain: string;
  deliverableType: string;
  verifiedAt: string;
  score: number;
  evidenceCount: number;
  reviewers: string[];
}

export interface VerificationRecord {
  date: string;
  type: string;
  label: string;
  color?: string;
}

export interface ProofPassportData {
  userId: string;
  userName: string;
  profession: string;
  domain: string;
  headline: string;
  location?: string;
  passportId: string;
  cryptographicHash: string;
  proofScore: number;
  capabilities: CapabilityScore[];
  verifiedDeliverables: VerifiedDeliverable[];
  verificationHistory: VerificationRecord[];
  publicShareToken?: string;
  issuedAt: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  profession: string;
  domain: string;
  headline: string;
  proofScore: number;
  confidence: 'HIGH' | 'MEDIUM' | 'EMERGING';
  verifiedProjects: number;
  expertReviews: number;
  defenseRounds: number;
  capabilities: Array<{ label: string; score: number }>;
  recentProof: {
    title: string;
    status: string;
    difficulty?: string;
  };
  keyDecision: string;
  techDecision?: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
  primaryProofLabel: string;
  location?: string;
  availability?: string;
}

export interface CandidateFilter {
  domain?: string;
  profession?: string;
  capability?: string;
  difficulty?: string;
  search?: string;
  minProofScore?: number;
  page?: number;
  limit?: number;
}

export interface Opportunity {
  _id: string;
  id?: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  domain: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'INTERVIEW_SCHEDULED';
  compensationRange?: string;
  location?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'REVIEW_COMPLETED' | 'DEFENSE_SCHEDULED' | 'OPPORTUNITY_RECEIVED' | 'CAPABILITY_UNLOCKED' | 'SYSTEM';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: string;
  verified?: boolean;
}

export interface CompetencyItem {
  name: string;
  weight: number;
  description?: string;
  proficiencyLevel?: 'Foundational' | 'Proficient' | 'Advanced' | 'Expert';
  verificationCriteria?: string[];
}

export interface JobDNA {
  technicalSkills?: Array<{ name: string; importance: string }>;
  problemSolvingFocus?: Array<{ dimension: string; weight: number }>;
  practicalRequirements?: string[];
  mandatoryRequirements?: string[];
  experienceYears?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  suggestedAssessmentTypes?: string[];
  generatedAt?: string;
}

export interface Job {
  _id: string;
  id?: string;
  title: string;
  organizationId: any;
  department: string;
  careerDomain: string;
  branch?: string;
  profession: string;
  experience: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  assessmentDurationMinutes: number;
  status: 'DRAFT' | 'DNA_GENERATED' | 'ASSESSMENT_READY' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
  jobDNA?: JobDNA;
  competencies?: CompetencyItem[];
  publishedAssessmentId?: any;
  applicantCount?: number;
  shortlistedCount?: number;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDependencyInfo {
  jobId: string;
  title: string;
  status: string;
  canHardDelete: boolean;
  canArchive: boolean;
  recommendedAction: 'HARD_DELETE' | 'ARCHIVE';
  dependencies: {
    applicationsCount: number;
    assessmentAttemptsCount: number;
    assessmentsCount: number;
    publishedAssessmentsCount: number;
    interviewsCount: number;
  };
  blockingReasons: string[];
}

export interface AssessmentDependencyInfo {
  assessmentId: string;
  title: string;
  version: number;
  status: string;
  canHardDelete: boolean;
  canArchive: boolean;
  recommendedAction: 'HARD_DELETE' | 'ARCHIVE';
  dependencies: {
    attemptsCount: number;
    jobApplicationsCount: number;
  };
  blockingReasons: string[];
}

export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface Assessment {
  _id: string;
  id?: string;
  jobId: any;
  version: number;
  title: string;
  careerDomain: string;
  profession: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeLimitMinutes: number;
  scenario: string;
  practicalTask: string;
  constraints: string[];
  deliverables: string[];
  toolsAllowed: string[];
  expectedCompetencies: string[];
  rubricCriteria: RubricCriterion[];
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdBy?: string;
  changeNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentAssignment {
  _id: string;
  id?: string;
  assessmentId: any;
  assessmentVersion: number;
  jobId: any;
  applicationId: any;
  candidateId: any;
  assignedAt: string;
  startedAt?: string;
  submittedAt?: string;
  attemptDurationMinutes?: number;
  status:
    | 'ASSIGNED'
    | 'STARTED'
    | 'SUBMITTED'
    | 'EVALUATING'
    | 'EVALUATED'
    | 'VERIFICATION_REQUIRED'
    | 'VERIFIED'
    | 'NOT_VERIFIED';
  candidateDeliverables?: {
    workUrl?: string;
    adrDecision?: string;
    notes?: string;
    modalityType?: string;
    artifactData?: any;
  };
  evaluationSummary?: {
    overallScore?: number;
    confidence?: string;
    evaluatedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AIEvaluationCriterionScore {
  criterionId: string;
  label: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

export interface AIEvaluation {
  overallScore: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  humanReviewRecommended: boolean;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  criterionScores: AIEvaluationCriterionScore[];
  evaluatedAt?: string;
}

export interface HumanReviewData {
  reviewerId: any;
  status: 'VERIFIED' | 'NEEDS_REVISION' | 'NOT_VERIFIED';
  agreedWithAI: boolean;
  rubricScores?: Record<string, any>;
  feedbackNotes: string;
  reviewedAt?: string;
}

export interface RoleFitData {
  score: number;
  competencyBreakdown: Array<{
    competency: string;
    alignmentScore: number;
    evidenceCount: number;
  }>;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  calculatedAt?: string;
}

export interface WhyShortlistedData {
  isShortlisted: boolean;
  reasons: string[];
  mandatoryRequirementsMet: string[];
  practicalAssessmentScore: number;
  verifiedEvidenceHighlight?: string;
  shortlistedAt?: string;
}

export interface FinalDecisionData {
  decision: 'SELECT' | 'HOLD' | 'REJECT' | 'PENDING';
  reason?: string;
  decidedBy?: any;
  decidedAt?: string;
}

export interface Application {
  _id: string;
  id?: string;
  candidateId: any;
  jobId: any;
  status:
    | 'APPLIED'
    | 'ELIGIBLE'
    | 'INELIGIBLE'
    | 'ASSESSMENT_PENDING'
    | 'ASSESSMENT_IN_PROGRESS'
    | 'ASSESSMENT_SUBMITTED'
    | 'UNDER_HUMAN_REVIEW'
    | 'VERIFIED'
    | 'SHORTLISTED'
    | 'INTERVIEW_SCHEDULED'
    | 'SELECTED'
    | 'ON_HOLD'
    | 'REJECTED';
  eligibility: {
    isEligible: boolean;
    checks: Array<{ name: string; passed: boolean; reason: string }>;
    summaryReason: string;
    checkedAt?: string;
  };
  assessmentAttempt?: {
    assessmentId?: any;
    startedAt?: string;
    submittedAt?: string;
    submissionContent?: {
      workUrl?: string;
      artifactData?: any;
      notes?: string;
      adrDecision?: string;
      modalityType?: string;
    };
    attemptDurationMinutes?: number;
  };
  aiEvaluation?: AIEvaluation;
  humanReview?: HumanReviewData;
  roleFit?: RoleFitData;
  whyShortlisted?: WhyShortlistedData;
  finalDecision?: FinalDecisionData;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneratedInterviewQuestion {
  id: string;
  question: string;
  competency?: string;
  difficulty?: string;
  evidenceContext?: string;
  evaluatorFocus?: string;
  sampleGoodAnswer?: string;
}

export interface ScorecardCriterion {
  criterionId: string;
  label: string;
  score: number;
  notes?: string;
}

export interface Interview {
  _id: string;
  id?: string;
  applicationId: any;
  candidateId: any;
  jobId: any;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  generatedQuestions: GeneratedInterviewQuestion[];
  scorecard: ScorecardCriterion[];
  interviewerNotes?: string;
  recommendation?: 'STRONG_YES' | 'YES' | 'NEUTRAL' | 'NO' | 'STRONG_NO' | 'PENDING';
  interviewerId: any;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruiterAnalytics {
  pipelineFunnel: {
    totalApplications: number;
    eligible: number;
    assessed: number;
    verified: number;
    shortlisted: number;
    interviews: number;
    selected: number;
  };
  conversionRates: {
    applicationToEligible: number;
    eligibleToAssessed: number;
    assessedToShortlisted: number;
    shortlistedToSelected: number;
  };
  efficiencyMetrics: {
    averageAssessmentTimeMinutes: number;
    reviewerAgreementPercent: number;
    averageRoleFitScore: number;
    timeToProofHours: number;
  };
  activeJobRequisitions: {
    total: number;
    open: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
