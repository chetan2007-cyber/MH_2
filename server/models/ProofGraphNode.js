const mongoose = require('mongoose');

const proofGraphNodeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    nodeId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    nodeType: {
      type: String,
      enum: [
        'CAPABILITY_ROOT',
        'CHALLENGE',
        'PROJECT',
        'CODE_COMMIT',
        'ARCHITECTURE',
        'ADR',
        'AUTOMATED_TESTS',
        'BENCHMARK',
        'EXPERT_REVIEW',
        'DEFENSE_ROUND',
        'IMPROVEMENT_DELTA',
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'PASSED', 'APPROVED', 'DEFENDED', 'PENDING'],
      default: 'VERIFIED',
    },
    scoreValue: {
      type: Number,
      default: null,
    },
    evidencePayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  { timestamps: true }
);

proofGraphNodeSchema.index({ candidateId: 1, nodeId: 1 }, { unique: true });

module.exports = mongoose.model('ProofGraphNode', proofGraphNodeSchema);
