const interviewService = require('../services/interviews/interview.service');

exports.generateQuestions = async (req, res) => {
  try {
    const result = await interviewService.generateInterviewQuestions(req.params.applicationId, req.user);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Generate interview questions error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const interview = await interviewService.scheduleInterview(req.body, req.user);
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getInterviewByApplication = async (req, res) => {
  try {
    const interview = await interviewService.getInterviewByApplication(req.params.applicationId);
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('Get interview by application error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.submitScorecard = async (req, res) => {
  try {
    const interview = await interviewService.submitScorecard(req.params.id, req.body, req.user);
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('Submit scorecard error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};
