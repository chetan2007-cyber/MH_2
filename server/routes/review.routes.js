const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuthenticate, authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/queue', optionalAuthenticate, reviewController.getReviewQueue);
router.get('/dossier/:submissionId', optionalAuthenticate, reviewController.getSubmissionForReview);
router.post('/:submissionId/evaluate', optionalAuthenticate, reviewController.submitReview);

// Reviewer draft management (saving, fetching, discarding draft)
router.post('/dossier/:submissionId/draft', optionalAuthenticate, reviewController.saveReviewDraft);
router.get('/dossier/:submissionId/draft', optionalAuthenticate, reviewController.getReviewDraft);
router.delete('/dossier/:submissionId/draft', optionalAuthenticate, reviewController.deleteReviewDraft);
router.post('/:submissionId/draft', optionalAuthenticate, reviewController.saveReviewDraft);
router.get('/:submissionId/draft', optionalAuthenticate, reviewController.getReviewDraft);
router.delete('/:submissionId/draft', optionalAuthenticate, reviewController.deleteReviewDraft);

// Review withdrawal (audited status update)
router.post('/dossier/:submissionId/withdraw', optionalAuthenticate, reviewController.withdrawReview);
router.patch('/dossier/:submissionId/withdraw', optionalAuthenticate, reviewController.withdrawReview);
router.post('/:submissionId/withdraw', optionalAuthenticate, reviewController.withdrawReview);
router.patch('/:submissionId/withdraw', optionalAuthenticate, reviewController.withdrawReview);

module.exports = router;
