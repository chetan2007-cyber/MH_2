const mongoose = require('mongoose');

const automatedCheckSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
      index: true,
    },
    testsPassed: {
      type: Number,
      required: true,
    },
    testsTotal: {
      type: Number,
      required: true,
    },
    passRate: {
      type: Number,
      required: true,
    },
    hiddenTestsPassed: {
      type: Number,
      required: true,
    },
    hiddenTestsTotal: {
      type: Number,
      required: true,
    },
    hiddenPassRate: {
      type: Number,
      required: true,
    },
    branchCoveragePct: {
      type: Number,
      default: 85,
    },
    mutationScorePct: {
      type: Number,
      default: 80,
    },
    p99LatencyMs: {
      type: Number,
      required: true,
    },
    throughputRps: {
      type: Number,
      required: true,
    },
    securityScanPassed: {
      type: Boolean,
      default: true,
    },
    sastIssuesCount: {
      type: Number,
      default: 0,
    },
    executionLogs: [
      {
        timestamp: { type: String },
        level: { type: String, enum: ['INFO', 'WARN', 'SUCCESS', 'ERROR'] },
        message: { type: String },
      },
    ],
    ranAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AutomatedCheck', automatedCheckSchema);
