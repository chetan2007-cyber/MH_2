const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/job/:jobId', assessmentController.getAssessmentsByJob);
router.get('/:id', assessmentController.getAssessmentById);
router.post('/generate', optionalAuthenticate, assessmentController.generateAssessment);
router.post('/generate/:jobId', optionalAuthenticate, assessmentController.generateAssessment);
router.patch('/:id', optionalAuthenticate, assessmentController.updateAssessment);
router.post('/:id/publish', optionalAuthenticate, assessmentController.publishAssessment);

module.exports = router;
