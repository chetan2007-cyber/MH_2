const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      default: 'Full-Stack & Systems Engineer',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Remote / Bengaluru, India',
    },
    githubUsername: {
      type: String,
      default: '',
    },
    githubConnected: {
      type: Boolean,
      default: false,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    targetRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    proofConfidence: {
      type: String,
      enum: ['HIGH', 'MODERATE', 'DEVELOPING', 'INSUFFICIENT'],
      default: 'DEVELOPING',
      index: true,
    },
    verificationLevel: {
      type: String,
      enum: ['LEVEL_1_SMOKE', 'LEVEL_2_CHAOS_VERIFIED', 'LEVEL_3_EXPERT_PEER_REVIEWED'],
      default: 'LEVEL_1_SMOKE',
    },
    publicProofToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    publicProofEnabled: {
      type: Boolean,
      default: true,
    },
    totalProjectsCount: {
      type: Number,
      default: 0,
    },
    advancedChallengesCount: {
      type: Number,
      default: 0,
    },
    expertReviewsCount: {
      type: Number,
      default: 0,
    },
    adrsDocumentedCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
