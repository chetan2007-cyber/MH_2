const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuthenticate, authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/queue', optionalAuthenticate, reviewController.getReviewQueue);
router.get('/dossier/:submissionId', optionalAuthenticate, reviewController.getSubmissionForReview);
router.post('/:submissionId/evaluate', optionalAuthenticate, reviewController.submitReview);

module.exports = router;
