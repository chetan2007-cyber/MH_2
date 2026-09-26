const mongoose = require('mongoose');

const defenseRoundSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questions: [
      {
        id: { type: String, required: true },
        prompt: { type: String, required: true },
        category: {
          type: String,
          enum: [
            'ARCHITECTURE_RATIONALE',
            'SCALABILITY_FAILURE_MODE',
            'CODE_EXPLANATION',
            'SECURITY_BOUNDARY',
            'LIVE_MUTATION_CHALLENGE',
          ],
          default: 'ARCHITECTURE_RATIONALE',
        },
        contextSnippet: { type: String, default: '' },
      },
    ],
    answers: [
      {
        questionId: { type: String, required: true },
        answerText: { type: String, required: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'EVALUATED'],
      default: 'PENDING',
      index: true,
    },
    confidence: {
      type: String,
      enum: ['STRONG', 'MODERATE', 'NEEDS_REVIEW', 'INCONSISTENT'],
      default: 'MODERATE',
    },
    evaluatorNotes: {
      type: String,
      default: 'Awaiting candidate defense submission.',
    },
    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DefenseRound', defenseRoundSchema);
