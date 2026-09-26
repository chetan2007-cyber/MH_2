const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', challengeController.getChallenges);
router.get('/:slug', challengeController.getChallengeBySlug);
router.post('/:challengeId/start', authenticate, requireRole('CANDIDATE'), challengeController.startChallenge);

module.exports = router;
