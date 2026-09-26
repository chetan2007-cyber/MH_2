const express = require('express');
const router = express.Router();
const proofGraphController = require('../controllers/proofGraphController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, proofGraphController.getProofGraph);
router.get('/:candidateId', authenticate, proofGraphController.getProofGraph);

module.exports = router;
