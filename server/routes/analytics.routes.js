const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/recruiter', optionalAuthenticate, analyticsController.getRecruiterAnalytics);

module.exports = router;
