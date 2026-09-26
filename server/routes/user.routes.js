const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');

router.get('/me', optionalAuthenticate, userController.getCurrentUser);
router.patch('/me', authenticate, userController.updateProfile);
router.get('/:id', optionalAuthenticate, userController.getUserById);
router.get('/:id/capabilities', optionalAuthenticate, userController.getUserCapabilities);
router.get('/:id/proof-graph', optionalAuthenticate, userController.getUserProofGraph);
router.get('/:id/proof-passport', optionalAuthenticate, userController.getUserProofPassport);

module.exports = router;
