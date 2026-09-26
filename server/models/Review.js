const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isDoubleBlind: {
      type: Boolean,
      default: true,
    },
    rubricScores: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    qualitativeSynthesis: {
      type: String,
      required: true,
    },
    improvementRecommendations: [
      {
        type: String,
      },
    ],
    reviewerConfidence: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    rriSnapshotAtReview: {
      type: Number,
      default: 1.0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
