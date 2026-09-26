const express = require('express');
const router = express.Router();
const defenseController = require('../controllers/defenseController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/:submissionId', authenticate, defenseController.getDefenseRound);
router.post('/:submissionId/submit', authenticate, requireRole('CANDIDATE'), defenseController.submitDefenseAnswers);

module.exports = router;
