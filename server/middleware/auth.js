const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const JWT_SECRET = process.env.JWT_SECRET || 'proofline_super_secure_jwt_secret_key_2026_production_grade';

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.proofline_token) {
      token = req.cookies.proofline_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid token. Please log in again.',
      });
    }

    // Check active session in DB (or verify user directly)
    let user = await User.findById(decoded.userId);
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        error: 'User account is inactive or not found.',
      });
    }

    req.user = user;
    req.sessionToken = decoded.sessionId || decoded.sessionToken;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, error: 'Internal authentication error' });
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.proofline_token) {
      token = req.cookies.proofline_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user && user.status === 'ACTIVE') {
          req.user = user;
        }
      } catch (err) {
        // Ignore invalid token in optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuthenticate, JWT_SECRET };
