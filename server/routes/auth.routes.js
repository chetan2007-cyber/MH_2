const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register/candidate', authLimiter, authController.registerCandidate);
router.post('/register/reviewer', authLimiter, authController.registerReviewer);
router.post('/register/recruiter', authLimiter, authController.registerRecruiter);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authLimiter, authController.login);
router.get('/me', optionalAuthenticate, authController.getCurrentUser);

router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.revokeAllOtherSessions);
router.get('/sessions', authenticate, authController.getActiveSessions);
router.delete('/sessions/:sessionId', authenticate, authController.revokeSession);
router.post('/forgot-password', authLimiter, authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
