const mongoose = require('mongoose');

const adrSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    decisionIndex: {
      type: Number,
      required: true,
      default: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACCEPTED', 'SUPERSEDED', 'PROPOSED', 'REJECTED'],
      default: 'ACCEPTED',
    },
    context: {
      type: String,
      required: true,
    },
    decision: {
      type: String,
      required: true,
    },
    alternatives: [
      {
        option: { type: String, required: true },
        pros: { type: String, default: '' },
        cons: { type: String, default: '' },
        rejectionReason: { type: String, required: true },
      },
    ],
    reasoning: {
      type: String,
      required: true,
    },
    tradeOffs: {
      type: String,
      required: true,
    },
    consequences: {
      positive: [{ type: String }],
      negative: [{ type: String }],
    },
    evidenceCitation: {
      type: String,
      required: true,
      placeholder: 'e.g. src/concurrency/lock_manager.go#L45-L89',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ADR', adrSchema);
