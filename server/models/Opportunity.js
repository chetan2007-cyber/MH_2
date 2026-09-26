const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    compensationRange: {
      type: String,
      default: '$140k - $190k + Equity',
    },
    locationType: {
      type: String,
      default: 'Remote (Global)',
    },
    whyReachedOut: {
      type: String,
      required: true,
    },
    skillsMatched: [
      {
        type: String,
      },
    ],
    referencedProjectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    status: {
      type: String,
      enum: ['SENT', 'ACCEPTED', 'DECLINED', 'QUESTION_ASKED'],
      default: 'SENT',
      index: true,
    },
    candidateResponseNotes: {
      type: String,
      default: '',
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
