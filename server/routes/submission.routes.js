const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', optionalAuthenticate, submissionController.listSubmissions);
router.get('/:submissionId', optionalAuthenticate, submissionController.getSubmissionWorkspace);
router.post('/:submissionId/architecture', optionalAuthenticate, submissionController.saveProjectArchitecture);
router.post('/:submissionId/adrs', optionalAuthenticate, submissionController.createOrUpdateADR);
router.delete('/:submissionId/adrs/:adrId', optionalAuthenticate, submissionController.deleteADR);
router.post('/:submissionId/verify', optionalAuthenticate, submissionController.triggerVerification);
router.post('/:submissionId/finalize', optionalAuthenticate, submissionController.finalizeSubmission);
router.get('/:submissionId/preflight', optionalAuthenticate, submissionController.getPreflightStatus);

module.exports = router;

