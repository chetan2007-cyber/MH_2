const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: 'Unknown IP',
    },
    userAgent: {
      type: String,
      default: 'Unknown Client',
    },
    deviceInfo: {
      browser: { type: String, default: 'Browser' },
      os: { type: String, default: 'OS' },
      device: { type: String, default: 'Desktop' },
    },
    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
