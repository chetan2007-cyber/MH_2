const mongoose = require('mongoose');

const evaluationCriterionScoreSchema = new mongoose.Schema(
  {
    criterionId: String,
    label: String,
    score: Number,
    maxScore: Number,
    feedback: String,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'APPLIED',
        'ELIGIBLE',
        'INELIGIBLE',
        'ASSESSMENT_PENDING',
        'ASSESSMENT_IN_PROGRESS',
        'ASSESSMENT_SUBMITTED',
        'UNDER_HUMAN_REVIEW',
        'VERIFIED',
        'SHORTLISTED',
        'INTERVIEW_SCHEDULED',
        'SELECTED',
        'ON_HOLD',
        'REJECTED',
      ],
      default: 'APPLIED',
      index: true,
    },
    eligibility: {
      isEligible: { type: Boolean, default: true },
      checks: [
        {
          name: String,
          passed: Boolean,
          reason: String,
        },
      ],
      summaryReason: String,
      checkedAt: { type: Date, default: Date.now },
    },
    assessmentAttempt: {
      assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
      },
      startedAt: Date,
      submittedAt: Date,
      submissionContent: {
        workUrl: String,
        artifactData: mongoose.Schema.Types.Mixed,
        notes: String,
        adrDecision: String,
        modalityType: { type: String, default: 'code' },
      },
      attemptDurationMinutes: Number,
    },
    aiEvaluation: {
      overallScore: { type: Number, min: 0, max: 100 },
      confidence: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'HIGH',
      },
      humanReviewRecommended: { type: Boolean, default: false },
      strengths: [String],
      weaknesses: [String],
      summary: String,
      criterionScores: [evaluationCriterionScoreSchema],
      evaluatedAt: Date,
    },
    humanReview: {
      reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['VERIFIED', 'NEEDS_REVISION', 'NOT_VERIFIED'],
      },
      agreedWithAI: Boolean,
      rubricScores: mongoose.Schema.Types.Mixed,
      feedbackNotes: String,
      reviewedAt: Date,
    },
    roleFit: {
      score: { type: Number, min: 0, max: 100, default: 0 },
      competencyBreakdown: [
        {
          competency: String,
          alignmentScore: Number,
          evidenceCount: Number,
        },
      ],
      confidenceLevel: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'HIGH',
      },
      calculatedAt: Date,
    },
    whyShortlisted: {
      isShortlisted: { type: Boolean, default: false },
      reasons: [String],
      mandatoryRequirementsMet: [String],
      practicalAssessmentScore: Number,
      verifiedEvidenceHighlight: String,
      shortlistedAt: Date,
    },
    finalDecision: {
      decision: {
        type: String,
        enum: ['SELECT', 'HOLD', 'REJECT', 'PENDING'],
        default: 'PENDING',
      },
      reason: String,
      decidedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      decidedAt: Date,
    },
  },
  { timestamps: true }
);

// Unique application per candidate per job
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
