const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const VerificationToken = require('../../models/VerificationToken');
const CandidateProfile = require('../../models/CandidateProfile');
const ReviewerProfile = require('../../models/ReviewerProfile');
const RecruiterProfile = require('../../models/RecruiterProfile');
const Organization = require('../../models/Organization');
const { JWT_SECRET } = require('../../middleware/auth');
const sessionService = require('./session.service');

class AuthService {
  async registerCandidate({ name, email, password, skills, targetRoles }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'CANDIDATE',
      emailVerified: false,
    });

    const publicProofToken = crypto.randomBytes(16).toString('hex');
    await CandidateProfile.create({
      userId: user._id,
      skills: Array.isArray(skills) ? skills : ['TypeScript', 'Node.js', 'PostgreSQL'],
      targetRoles: Array.isArray(targetRoles) ? targetRoles : ['Backend Engineer', 'Systems Engineer'],
      publicProofToken,
      publicProofEnabled: true,
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: verifyToken,
      type: 'EMAIL_VERIFY',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { user, verifyToken };
  }

  async registerReviewer({ name, email, password, expertiseDomains, yearsExperience }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'REVIEWER',
      emailVerified: false,
    });

    await ReviewerProfile.create({
      userId: user._id,
      expertiseDomains: Array.isArray(expertiseDomains) ? expertiseDomains : ['Distributed Systems'],
      yearsExperience: Number(yearsExperience) || 5,
      calibrationScore: 1.0,
      assignedSubmissionsCount: 0,
      completedReviewsCount: 0,
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: verifyToken,
      type: 'EMAIL_VERIFY',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { user, verifyToken };
  }

  async registerRecruiter({ name, email, password, organizationName, roleTitle }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    let org = await Organization.findOne({ name: organizationName || 'Tech Organization' });
    if (!org) {
      org = await Organization.create({
        name: organizationName || 'Tech Organization',
        domain: (email.split('@')[1] || 'tech.org').toLowerCase(),
        isVerified: true,
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'RECRUITER',
      emailVerified: false,
    });

    await RecruiterProfile.create({
      userId: user._id,
      organizationId: org._id,
      roleTitle: roleTitle || 'Technical Talent Lead',
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: verifyToken,
      type: 'EMAIL_VERIFY',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { user, verifyToken };
  }

  async verifyEmail(token) {
    if (!token) throw new Error('Verification token is required.');

    const tokenDoc = await VerificationToken.findOne({
      token,
      type: 'EMAIL_VERIFY',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      throw new Error('Invalid or expired verification token.');
    }

    await User.findByIdAndUpdate(tokenDoc.userId, { emailVerified: true });
    await VerificationToken.deleteOne({ _id: tokenDoc._id });
    return tokenDoc.userId;
  }

  async authenticate({ email, password, ipAddress, userAgent }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account has been suspended for security audit.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const session = await sessionService.createSession({
      userId: user._id,
      ipAddress,
      userAgent,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        sessionId: session.tokenHash,
        sessionToken: session.tokenHash,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token, session };
  }

  async getProfileForUser(user) {
    let profile = null;
    if (user.role === 'CANDIDATE') {
      profile = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'REVIEWER') {
      profile = await ReviewerProfile.findOne({ userId: user._id });
    } else if (user.role === 'RECRUITER') {
      profile = await RecruiterProfile.findOne({ userId: user._id }).populate('organizationId');
    }
    return profile;
  }

  async requestPasswordReset(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: resetToken,
      type: 'PASSWORD_RESET',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    return resetToken;
  }

  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      throw new Error('Reset token and new password are required.');
    }
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const tokenDoc = await VerificationToken.findOne({
      token,
      type: 'PASSWORD_RESET',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      throw new Error('Invalid or expired password reset token.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(tokenDoc.userId, { passwordHash });
    await VerificationToken.deleteOne({ _id: tokenDoc._id });
    await sessionService.revokeAllOtherSessions(tokenDoc.userId, null);
    return tokenDoc.userId;
  }
}

module.exports = new AuthService();
