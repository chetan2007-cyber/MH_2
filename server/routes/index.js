const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const jobRoutes = require('./job.routes');
const assessmentRoutes = require('./assessment.routes');
const applicationRoutes = require('./application.routes');
const interviewRoutes = require('./interview.routes');
const analyticsRoutes = require('./analytics.routes');
const notificationRoutes = require('./notification.routes');
const challengeRoutes = require('./challenge.routes');
const submissionRoutes = require('./submission.routes');
const defenseRoutes = require('./defense.routes');
const reviewRoutes = require('./review.routes');
const capabilityRoutes = require('./capability.routes');
const proofGraphRoutes = require('./proofgraph.routes');
const passportRoutes = require('./passport.routes');
const recruiterRoutes = require('./recruiter.routes');
const candidateRoutes = require('./candidate.routes');
const opportunityRoutes = require('./opportunity.routes');
const trustRoutes = require('./trust.routes');
const adminRoutes = require('./admin.routes');
const codeCheckRoutes = require('./codeCheck.routes');
const passportController = require('../controllers/passportController');

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/applications', applicationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/challenges', challengeRoutes);
router.use('/submissions', submissionRoutes);
router.use('/defense', defenseRoutes);
router.use('/reviews', reviewRoutes);
router.use('/capabilities', capabilityRoutes);
router.use('/proofgraph', proofGraphRoutes);
router.use('/passport', passportRoutes);
router.use('/recruiters', recruiterRoutes);
router.use('/candidates', candidateRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/trust', trustRoutes);
router.use('/admin', adminRoutes);
router.use('/code-check', codeCheckRoutes);

// Public Proof Verification Endpoint
router.get('/public/proof/:token', passportController.getPublicProof);

module.exports = router;
