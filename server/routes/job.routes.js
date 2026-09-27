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
router.get('/:id/dependencies', optionalAuthenticate, jobController.getJobDependencies);
router.delete('/:id', optionalAuthenticate, jobController.deleteJob);
router.patch('/:id/archive', optionalAuthenticate, jobController.archiveJob);
router.post('/:id/archive', optionalAuthenticate, jobController.archiveJob);
router.patch('/:id/restore', optionalAuthenticate, jobController.restoreJob);

module.exports = router;
