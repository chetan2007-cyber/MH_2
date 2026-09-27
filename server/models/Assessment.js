const mongoose = require('mongoose');

const rubricCriterionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: true },
    maxScore: { type: Number, default: 5 },
    weight: { type: Number, default: 20 },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    careerDomain: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    timeLimitMinutes: {
      type: Number,
      default: 60,
    },
    scenario: {
      type: String,
      required: true,
    },
    practicalTask: {
      type: String,
      required: true,
    },
    constraints: [String],
    deliverables: [String],
    toolsAllowed: [String],
    expectedCompetencies: [String],
    rubricCriteria: [rubricCriterionSchema],
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: Date,
    archivedAt: Date,
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    archiveReason: String,
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeNotes: {
      type: String,
      default: 'Initial AI assessment draft generated from Job DNA.',
    },
  },
  { timestamps: true }
);

// Compound index for unique versioning per job
assessmentSchema.index({ jobId: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
