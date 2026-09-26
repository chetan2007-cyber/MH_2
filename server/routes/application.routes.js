const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', optionalAuthenticate, applicationController.getAllApplications);
router.post('/', optionalAuthenticate, applicationController.applyToJob);
router.get('/my', optionalAuthenticate, applicationController.getMyApplications);
router.get('/job/:jobId', optionalAuthenticate, applicationController.getApplicationsByJob);
router.get('/job/:jobId/stats', optionalAuthenticate, applicationController.getAssessmentStatsByJob);
router.get('/:id', optionalAuthenticate, applicationController.getApplicationById);
router.get('/:id/assessment', optionalAuthenticate, applicationController.getAssessmentForApplication);
router.post('/:id/start-assessment', optionalAuthenticate, applicationController.startAssessmentAttempt);
router.post('/:id/submit-attempt', optionalAuthenticate, applicationController.submitAssessmentAttempt);
router.post('/:id/review', optionalAuthenticate, applicationController.submitHumanReview);
router.post('/:id/decision', optionalAuthenticate, applicationController.makeFinalDecision);

module.exports = router;

