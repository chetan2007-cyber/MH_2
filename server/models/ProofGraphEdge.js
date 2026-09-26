const mongoose = require('mongoose');

const proofGraphEdgeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    edgeId: {
      type: String,
      required: true,
    },
    source: {
      type: String, // source nodeId
      required: true,
    },
    target: {
      type: String, // target nodeId
      required: true,
    },
    relationType: {
      type: String,
      default: 'PROVES',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProofGraphEdge', proofGraphEdgeSchema);
