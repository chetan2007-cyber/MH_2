const express = require('express');
const router = express.Router();
const capabilityController = require('../controllers/capabilityController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/', optionalAuthenticate, capabilityController.getMyCapabilities);
router.get('/:candidateId', optionalAuthenticate, capabilityController.getCandidateCapabilities);
router.get('/:candidateId/explain/:dimension', optionalAuthenticate, capabilityController.getScoreExplanation);

module.exports = router;
