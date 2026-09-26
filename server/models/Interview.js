const mongoose = require('mongoose');

const generatedQuestionSchema = new mongoose.Schema(
  {
    id: String,
    question: { type: String, required: true },
    competency: String,
    difficulty: String,
    evidenceContext: String,
    evaluatorFocus: String,
    sampleGoodAnswer: String,
  },
  { _id: false }
);

const scorecardCriterionSchema = new mongoose.Schema(
  {
    criterionId: String,
    label: String,
    score: { type: Number, min: 1, max: 5 },
    notes: String,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
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
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
      index: true,
    },
    generatedQuestions: [generatedQuestionSchema],
    scorecard: [scorecardCriterionSchema],
    interviewerNotes: String,
    recommendation: {
      type: String,
      enum: ['STRONG_YES', 'YES', 'NEUTRAL', 'NO', 'STRONG_NO', 'PENDING'],
      default: 'PENDING',
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
