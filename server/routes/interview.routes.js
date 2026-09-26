const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/questions/:applicationId', optionalAuthenticate, interviewController.generateQuestions);
router.post('/generate/:applicationId', optionalAuthenticate, interviewController.generateQuestions);
router.get('/application/:applicationId', optionalAuthenticate, interviewController.getInterviewByApplication);
router.post('/schedule', optionalAuthenticate, interviewController.scheduleInterview);
router.post('/:id/scorecard', optionalAuthenticate, interviewController.submitScorecard);

module.exports = router;
