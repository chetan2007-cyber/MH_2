const express = require('express');
const router = express.Router();
const trustController = require('../controllers/trustController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, trustController.getTrustSignals);
router.get('/:candidateId', authenticate, trustController.getTrustSignals);

module.exports = router;
