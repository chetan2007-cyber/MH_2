const express = require('express');
const router = express.Router();
const codeAnalysisController = require('../controllers/codeAnalysisController');

router.post('/analyze', codeAnalysisController.analyzeCode);
router.get('/latest', codeAnalysisController.getLatestAnalysis);
router.get('/:id', codeAnalysisController.getAnalysisById);
router.get('/comparison/:id', codeAnalysisController.getComparisonDetails);
router.post('/verify', codeAnalysisController.verifyIntegrity);

module.exports = router;
