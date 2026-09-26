const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/me', authenticate, requireRole('CANDIDATE'), passportController.getMyPassport);
router.post('/token/generate', authenticate, requireRole('CANDIDATE'), passportController.generatePublicProofToken);
router.post('/token/revoke', authenticate, requireRole('CANDIDATE'), passportController.revokePublicProofToken);
router.get('/public/:token', passportController.getPublicProof);

module.exports = router;
