const jobService = require('../services/jobs/job.service');

exports.createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body, req.user);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.listJobs = async (req, res) => {
  try {
    const jobs = await jobService.listJobs(req.query);
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.generateJobDNA = async (req, res) => {
  try {
    const job = await jobService.generateJobDNA(req.params.id, req.user);
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Generate Job DNA error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateCompetencies = async (req, res) => {
  try {
    const job = await jobService.updateCompetencies(req.params.id, req.body.competencies, req.user);
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Update competencies error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const job = await jobService.updateStatus(req.params.id, req.body.status, req.user);
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};
