const mongoose = require('mongoose');

const competencyItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String },
    proficiencyLevel: {
      type: String,
      enum: ['Foundational', 'Proficient', 'Advanced', 'Expert'],
      default: 'Proficient',
    },
    verificationCriteria: [String],
  },
  { _id: false }
);

const jobDNASchema = new mongoose.Schema(
  {
    technicalSkills: [{ name: String, importance: String }],
    problemSolvingFocus: [{ dimension: String, weight: Number }],
    practicalRequirements: [String],
    mandatoryRequirements: [String],
    experienceYears: { type: Number, default: 2 },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    suggestedAssessmentTypes: [String],
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    careerDomain: {
      type: String,
      required: true,
      default: 'technology',
      index: true,
    },
    branch: {
      type: String,
      default: '',
    },
    profession: {
      type: String,
      required: true,
      index: true,
    },
    experience: {
      type: String,
      default: '2-5 years',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    location: {
      type: String,
      default: 'Bangalore, India (Hybrid)',
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: [String],
    optionalSkills: [String],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    assessmentDurationMinutes: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'DNA_GENERATED', 'ASSESSMENT_READY', 'OPEN', 'CLOSED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
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
    jobDNA: jobDNASchema,
    competencies: [competencyItemSchema],
    publishedAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    shortlistedCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
