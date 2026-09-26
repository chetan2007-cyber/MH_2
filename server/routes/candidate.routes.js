const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/', optionalAuthenticate, candidateController.searchCandidates);
router.get('/:id', optionalAuthenticate, candidateController.getCandidateById);
router.post('/compare', optionalAuthenticate, candidateController.compareCandidates);

module.exports = router;
