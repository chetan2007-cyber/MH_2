const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
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
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    architectureSummary: {
      type: String,
      required: true,
    },
    systemComponents: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        tech: { type: String, required: true },
        communication: { type: String, default: 'gRPC / HTTP' },
      },
    ],
    dataFlowDescription: {
      type: String,
      required: true,
    },
    techStack: [
      {
        type: String,
      },
    ],
    deployedUrl: {
      type: String,
      default: '',
    },
    technicalExplanation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
