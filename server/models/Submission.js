const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      default: 'main',
    },
    commitSha: {
      type: String,
      required: true,
      default: () => Math.random().toString(16).substring(2, 10),
    },
    status: {
      type: String,
      enum: [
        'INITIALIZED',
        'BUILDING',
        'TESTING',
        'DEFENSE_PENDING',
        'UNDER_REVIEW',
        'VERIFIED',
        'FAILED',
        'REVISION_REQUESTED',
      ],
      default: 'INITIALIZED',
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    previousSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
    preflightChecks: {
      repoValid: { type: Boolean, default: false },
      readmeValid: { type: Boolean, default: false },
      architectureValid: { type: Boolean, default: false },
      adrValid: { type: Boolean, default: false },
      testsValid: { type: Boolean, default: false },
      explanationValid: { type: Boolean, default: false },
    },
    improvementNotes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
