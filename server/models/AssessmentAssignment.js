const mongoose = require('mongoose');

const assessmentAssignmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    assessmentVersion: {
      type: Number,
      default: 1,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
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
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
    attemptDurationMinutes: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        'ASSIGNED',
        'STARTED',
        'SUBMITTED',
        'EVALUATING',
        'EVALUATED',
        'VERIFICATION_REQUIRED',
        'VERIFIED',
        'NOT_VERIFIED',
      ],
      default: 'ASSIGNED',
      index: true,
    },
    candidateDeliverables: {
      workUrl: String,
      adrDecision: String,
      notes: String,
      modalityType: { type: String, default: 'code' },
      artifactData: mongoose.Schema.Types.Mixed,
    },
    evaluationSummary: {
      overallScore: Number,
      confidence: String,
      evaluatedAt: Date,
    },
  },
  { timestamps: true }
);

// Compound index: unique assignment per candidate per job
assessmentAssignmentSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentAssignment', assessmentAssignmentSchema);
