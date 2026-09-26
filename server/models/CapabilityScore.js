const mongoose = require('mongoose');

const capabilityScoreSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dimension: {
      type: String,
      required: true,
      enum: [
        'BACKEND_APIS',
        'DATABASE_ENGINEERING',
        'SYSTEM_DESIGN',
        'TESTING_RELIABILITY',
        'SECURITY_DEFENSE',
        'PERFORMANCE_OPTIMIZATION',
        'DEVOPS_INFRASTRUCTURE',
        'FRONTEND_ARCHITECTURE',
      ],
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null, // null if Insufficient Evidence
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'DEVELOPING', 'INSUFFICIENT_EVIDENCE'],
      default: 'INSUFFICIENT_EVIDENCE',
      index: true,
    },
    confidence: {
      type: String,
      enum: ['HIGH', 'MODERATE', 'LOW', 'NONE'],
      default: 'NONE',
    },
    explanation: {
      verifiedProjectsCount: { type: Number, default: 0 },
      advancedChallengesCount: { type: Number, default: 0 },
      expertReviewsCount: { type: Number, default: 0 },
      adrsCount: { type: Number, default: 0 },
      testPassRateAvg: { type: Number, default: 0 },
      defenseRoundStatus: { type: String, default: 'Not Started' },
      consistencyFactor: { type: String, default: 'Developing' },
      improvementEvident: { type: Boolean, default: false },
      summaryPoints: [{ type: String }],
    },
    contributingSubmissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
      },
    ],
    lastDemonstratedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

capabilityScoreSchema.index({ candidateId: 1, dimension: 1 }, { unique: true });

module.exports = mongoose.model('CapabilityScore', capabilityScoreSchema);
