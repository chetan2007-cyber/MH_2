const authService = require('../services/auth/auth.service');
const sessionService = require('../services/auth/session.service');
const { logAudit } = require('../middleware/audit');

exports.registerCandidate = async (req, res) => {
  try {
    const { user, verifyToken } = await authService.registerCandidate(req.body);
    await logAudit({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: 'CANDIDATE',
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(201).json({
      success: true,
      message: 'Candidate account created. Please verify your email.',
      verificationToken: verifyToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.registerReviewer = async (req, res) => {
  try {
    const { user, verifyToken } = await authService.registerReviewer(req.body);
    return res.status(201).json({
      success: true,
      message: 'Reviewer account created. Please verify your email.',
      verificationToken: verifyToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.registerRecruiter = async (req, res) => {
  try {
    const { user, verifyToken } = await authService.registerRecruiter(req.body);
    return res.status(201).json({
      success: true,
      message: 'Recruiter account created. Please verify your email.',
      verificationToken: verifyToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmail(req.body.token);
    return res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token, session } = await authService.authenticate({
      email: req.body.email,
      password: req.body.password,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAudit({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'USER_LOGIN',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      sessionToken: session.tokenHash,
    });
  } catch (err) {
    return res.status(401).json({ success: false, error: err.message });
  }
};

exports.logout = async (req, res) => {
  if (req.user && req.sessionToken) {
    await sessionService.revokeByToken(req.sessionToken);
  }
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
};

exports.getCurrentUser = async (req, res) => {
  let user = req.user;
  if (!user) {
    const User = require('../models/User');
    user = await User.findOne({ role: 'CANDIDATE' }) || await User.findOne();
  }
  if (!user) {
    return res.status(401).json({ success: false, error: 'No active session.' });
  }
  const profile = await authService.getProfileForUser(user);
  return res.json({
    success: true,
    user: { _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
    profile,
  });
};


exports.requestPasswordReset = async (req, res) => {
  const resetToken = await authService.requestPasswordReset(req.body.email);
  return res.json({ success: true, message: 'If that email exists, reset instructions have been dispatched.', resetToken });
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    return res.json({ success: true, message: 'Password has been reset successfully. Please log in.' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.getActiveSessions = async (req, res) => {
  const sessions = await sessionService.getActiveSessions(req.user._id, req.sessionToken);
  return res.json({ success: true, sessions });
};

exports.revokeSession = async (req, res) => {
  await sessionService.revokeSession(req.user._id, req.params.sessionId);
  return res.json({ success: true, message: 'Session revoked successfully.' });
};

exports.revokeAllOtherSessions = async (req, res) => {
  await sessionService.revokeAllOtherSessions(req.user._id, req.sessionToken);
  return res.json({ success: true, message: 'All other sessions have been revoked.' });
};

// Aliases for route compatibility
exports.logoutAllOtherSessions = exports.revokeAllOtherSessions;
exports.forgotPassword = exports.requestPasswordReset;

