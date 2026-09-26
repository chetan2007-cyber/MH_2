const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/discover', authenticate, requireRole('RECRUITER', 'ADMIN'), recruiterController.discoverCandidates);
router.get('/candidate/:candidateId', authenticate, requireRole('RECRUITER', 'ADMIN'), recruiterController.discoverCandidates);
router.post('/candidate/:candidateId/toggle-save', authenticate, requireRole('RECRUITER', 'ADMIN'), recruiterController.toggleSaveCandidate);

module.exports = router;
