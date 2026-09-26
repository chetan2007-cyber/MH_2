const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { optionalAuthenticate } = require('../middleware/auth');

router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJobById);
router.post('/', optionalAuthenticate, jobController.createJob);
router.post('/:id/analyze', optionalAuthenticate, jobController.generateJobDNA);
router.post('/:id/generate-dna', optionalAuthenticate, jobController.generateJobDNA);
router.patch('/:id/competencies', optionalAuthenticate, jobController.updateCompetencies);
router.patch('/:id/status', optionalAuthenticate, jobController.updateStatus);

module.exports = router;
