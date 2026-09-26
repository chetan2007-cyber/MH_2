const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      enum: [
        'BACKEND_API',
        'DISTRIBUTED_SYSTEMS',
        'DATABASE_ENGINEERING',
        'SECURITY_AUDIT',
        'PERFORMANCE_DEBUGGING',
        'SYSTEM_DESIGN',
        'DEVOPS_INFRASTRUCTURE',
        'FULL_STACK',
      ],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['FOUNDATION', 'PRODUCTION', 'ADVANCED', 'STAFF'],
      default: 'PRODUCTION',
      required: true,
      index: true,
    },
    difficultyWeight: {
      type: Number,
      default: 1.0, // 0.7 Foundation, 1.0 Production, 1.4 Advanced, 1.85 Staff
    },
    timeEstimateHours: {
      type: Number,
      default: 4,
    },
    summary: {
      type: String,
      required: true,
    },
    businessContext: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    constraints: {
      p99LatencyTargetMs: { type: Number, default: 50 },
      minThroughputRps: { type: Number, default: 1000 },
      memoryCeilingMb: { type: Number, default: 512 },
      zeroDataLoss: { type: Boolean, default: true },
    },
    starterRepoUrl: {
      type: String,
      default: 'https://github.com/proofline-challenges/starter-template',
    },
    skills: [
      {
        type: String,
        index: true,
      },
    ],
    evaluationCriteria: [
      {
        type: String,
      },
    ],
    hiddenTestsCount: {
      type: Number,
      default: 12,
    },
    totalSubmissionsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
