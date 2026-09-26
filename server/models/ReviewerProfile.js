const mongoose = require('mongoose');

const reviewerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    expertiseDomains: [
      {
        type: String,
        trim: true,
      },
    ],
    primaryLanguage: {
      type: String,
      default: 'TypeScript / Go',
    },
    yearsExperience: {
      type: Number,
      default: 5,
    },
    reliabilityIndex: {
      type: Number,
      default: 1.0, // RRI multiplier (0.2 to 2.0)
      index: true,
    },
    reviewsCompleted: {
      type: Number,
      default: 0,
    },
    calibrationDivergenceAvg: {
      type: Number,
      default: 0.2, // standard deviations from consensus
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CALIBRATING', 'SUSPENDED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReviewerProfile', reviewerProfileSchema);
