const applicationService = require('../services/applications/application.service');

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await applicationService.getAllApplications(req.query);
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const application = await applicationService.applyToJob(req.body.jobId, req.user);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const CandidateProfile = require('../models/CandidateProfile');

exports.getMyApplications = async (req, res) => {
  try {
    let candidate = req.user;
    if (!candidate?._id) {
      const p = await CandidateProfile.findOne();
      candidate = p ? { _id: p.userId } : null;
    }
    if (!candidate?._id) {
      return res.json({ success: true, count: 0, data: [] });
    }
    const applications = await applicationService.getMyApplications(candidate);
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsByJob(req.params.jobId, req.query);
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Get applications by job error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Get application by id error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.startAssessmentAttempt = async (req, res) => {
  try {
    const result = await applicationService.startAssessmentAttempt(req.params.id, req.user);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Start assessment attempt error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAssessmentForApplication = async (req, res) => {
  try {
    const result = await applicationService.getAssessmentForApplication(req.params.id, req.user);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get assessment for application error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.getAssessmentStatsByJob = async (req, res) => {
  try {
    const stats = await applicationService.getAssessmentStatsByJob(req.params.jobId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get assessment stats by job error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.submitAssessmentAttempt = async (req, res) => {
  try {
    const application = await applicationService.submitAssessmentAttempt(req.params.id, req.body, req.user);
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Submit assessment attempt error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.submitHumanReview = async (req, res) => {
  try {
    const application = await applicationService.submitHumanReview(req.params.id, req.body, req.user);
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Submit human review error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.makeFinalDecision = async (req, res) => {
  try {
    const application = await applicationService.makeFinalDecision(req.params.id, req.body, req.user);
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Make final decision error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

