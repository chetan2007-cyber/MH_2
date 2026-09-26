const assessmentService = require('../services/assessments/assessment.service');

exports.generateAssessment = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId;
    const assessment = await assessmentService.generateAssessment(jobId, req.user);
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    console.error('Generate assessment error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAssessmentsByJob = async (req, res) => {
  try {
    const assessments = await assessmentService.getAssessmentsByJob(req.params.jobId);
    res.json({ success: true, count: assessments.length, data: assessments });
  } catch (error) {
    console.error('Get assessments by job error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await assessmentService.getAssessmentById(req.params.id);
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Get assessment by id error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await assessmentService.updateAssessment(req.params.id, req.body, req.user);
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.publishAssessment = async (req, res) => {
  try {
    const assessment = await assessmentService.publishAssessment(req.params.id, req.user);
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Publish assessment error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};
