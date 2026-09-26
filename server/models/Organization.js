const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    domain: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    hiringDomains: [
      {
        type: String,
      },
    ],
    logoUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'Engineering-first technology organization',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
