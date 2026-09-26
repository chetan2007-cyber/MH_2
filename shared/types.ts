import { UserRole, CapabilityDimension, SubmissionStatus, EvidenceType } from './constants';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt?: string;
}

export interface CandidateProfile {
  id?: string;
  userId: string;
  headline: string;
  bio?: string;
  skills: string[];
  targetRoles: string[];
  location?: string;
  publicProofEnabled: boolean;
  publicProofToken?: string;
  compositeScore?: number;
}

export interface ChallengeConstraint {
  p99LatencyTargetMs: number;
  memoryLimitMb: number;
  concurrencyRps: number;
  threadSafetyCheck: boolean;
}

export interface Challenge {
  id: string;
  _id?: string;
  slug: string;
  title: string;
  domain: string;
  difficulty: 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED' | 'STAFF';
  scenario: string;
  constraints: ChallengeConstraint;
  evaluationRubric: Array<{ dimension: string; weight: number; criteria: string }>;
  estimatedHours: number;
  starterRepoUrl: string;
  verificationTypes: string[];
}

export interface ADRAlternative {
  option: string;
  rejectionReason: string;
}

export interface ADR {
  id?: string;
  _id?: string;
  submissionId: string;
  title: string;
  context: string;
  decision: string;
  alternatives: ADRAlternative[];
  reasoning: string;
  consequences: { positive: string[]; negative: string[] };
  evidenceCitation: string;
  version?: number;
}

export interface Submission {
  id: string;
  _id?: string;
  candidateId: string;
  challengeId: string | Challenge;
  status: SubmissionStatus;
  repoUrl: string;
  commitSha: string;
  verificationLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CapabilityScore {
  id?: string;
  _id?: string;
  candidateId: string;
  dimension: CapabilityDimension;
  score: number;
  confidence: 'PROVISIONAL' | 'MEDIUM' | 'HIGH';
  verifiedEvidenceCount: number;
  lastUpdated?: string;
  explanation?: {
    summaryPoints: string[];
    evidenceWeightBreakdown: Record<string, number>;
  };
}

export interface ProofGraphNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  score?: number;
  confidence?: string;
  metadata?: any;
}

export interface ProofGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight?: number;
}

export interface ProofGraphData {
  nodes: ProofGraphNode[];
  edges: ProofGraphEdge[];
}

export interface Opportunity {
  id: string;
  _id?: string;
  candidateId: string;
  recruiterId: string;
  organizationId: { name: string; industry?: string };
  roleTitle: string;
  compensationRange: string;
  whyReachedOut: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  skillsMatched: string[];
  createdAt?: string;
}

export interface ReviewQueueItem {
  submissionId: string;
  commitSha: string;
  adrCount: number;
  defenseStatus: string;
  challenge: {
    title: string;
    difficulty: string;
    domain: string;
  };
}
