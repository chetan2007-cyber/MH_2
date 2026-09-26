const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { optionalAuthenticate } = require('../middleware/auth');

router.post('/', optionalAuthenticate, opportunityController.sendOpportunity);
router.post('/send', optionalAuthenticate, opportunityController.sendOpportunity);
router.get('/', optionalAuthenticate, opportunityController.getOpportunities);
router.patch('/:opportunityId', optionalAuthenticate, opportunityController.respondToOpportunity);
router.post('/:opportunityId/respond', optionalAuthenticate, opportunityController.respondToOpportunity);

module.exports = router;
