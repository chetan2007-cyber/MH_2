const mongoose = require('mongoose');

const codeAnalysisSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      index: true,
      default: null,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      index: true,
      default: null,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
      default: null,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      index: true,
      default: null,
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go'],
      lowercase: true,
      trim: true,
    },
    codeSnippet: {
      type: String,
      required: true,
    },
    codeHash: {
      type: String,
      index: true,
    },
    normalizedTokensHash: {
      type: String,
      index: true,
    },
    qualityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    qualityStatus: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'NEEDS_IMPROVEMENT', 'HIGH_RISK'],
      required: true,
    },
    dimensions: {
      correctness: { type: Number, default: 85 },
      readability: { type: Number, default: 80 },
      maintainability: { type: Number, default: 80 },
      complexity: { type: Number, default: 80 },
      security: { type: Number, default: 90 },
      performance: { type: Number, default: 80 },
      codeStyle: { type: Number, default: 85 },
      errorHandling: { type: Number, default: 80 },
      documentation: { type: Number, default: 75 },
    },
    strengths: [String],
    issues: [String],
    suggestions: [String],
    testResults: {
      passed: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['PASSED', 'FAILED', 'PARTIAL', 'NOT_CONFIGURED', 'SYNTAX_ERROR'],
        default: 'NOT_CONFIGURED',
      },
      details: [
        {
          name: String,
          status: { type: String, enum: ['PASSED', 'FAILED', 'ERROR'] },
          message: String,
          durationMs: Number,
        },
      ],
    },
    securityFindings: [
      {
        severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW', 'INFO'], default: 'LOW' },
        rule: String,
        message: String,
        line: Number,
      },
    ],
    similarityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    similarityStatus: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW',
    },
    matchedSubmissions: [
      {
        submissionId: { type: String },
        candidateId: { type: String },
        candidateName: { type: String, default: 'Candidate' },
        similarity: { type: Number, required: true },
        isReferenceSolution: { type: Boolean, default: false },
        matchedLines: [Number],
        matchingRegionsCount: { type: Number, default: 0 },
        largestMatchingRegion: { type: Number, default: 0 },
        sampleMatch: { type: String, default: '' },
        similarSnippet: { type: String, default: '' },
      },
    ],
    integrityStatus: {
      type: String,
      enum: ['VERIFIED', 'REVIEW_RECOMMENDED'],
      default: 'VERIFIED',
    },
    reviewerVerification: {
      decision: {
        type: String,
        enum: ['VERIFIED', 'NEEDS_REVIEW', 'NOT_VERIFIED', 'PENDING'],
        default: 'PENDING',
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      notes: String,
    },
    analyzerVersion: {
      type: String,
      default: '1.2.0',
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodeAnalysis', codeAnalysisSchema);
