const codeAnalysisService = require('../services/codeAnalysis.service');
const CodeAnalysis = require('../models/CodeAnalysis');

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language, assessmentId, candidateId, submissionId, jobId, challengeId } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Code snippet cannot be empty.',
      });
    }

    const effectiveCandidateId = candidateId || req.user?.id || null;

    const analysis = await codeAnalysisService.analyzeCode({
      code,
      language: language || 'javascript',
      assessmentId,
      candidateId: effectiveCandidateId,
      submissionId,
      jobId,
      challengeId,
    });

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Code Analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete code proof check.',
    });
  }
};

exports.getLatestAnalysis = async (req, res) => {
  try {
    const { assessmentId, submissionId, candidateId, jobId } = req.query;
    const query = {};

    if (submissionId) query.submissionId = submissionId;
    else if (assessmentId) query.assessmentId = assessmentId;
    else if (candidateId) query.candidateId = candidateId;
    else if (jobId) query.jobId = jobId;
    else {
      // Return most recent analysis in system
    }

    const latest = await CodeAnalysis.findOne(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: latest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await CodeAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis record not found' });
    }
    return res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getComparisonDetails = async (req, res) => {
  try {
    const analysis = await CodeAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis record not found' });
    }

    const matchIndex = parseInt(req.query.matchIndex || '0', 10);
    const matched = analysis.matchedSubmissions && analysis.matchedSubmissions[matchIndex];

    return res.status(200).json({
      success: true,
      data: {
        candidateCode: analysis.codeSnippet,
        candidateLanguage: analysis.language,
        matchedSubmission: matched || null,
        similarityScore: analysis.similarityScore,
        similarityStatus: analysis.similarityStatus,
        integrityStatus: analysis.integrityStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyIntegrity = async (req, res) => {
  try {
    const { analysisId, decision, notes } = req.body;
    if (!analysisId || !decision) {
      return res.status(400).json({ success: false, error: 'analysisId and decision are required' });
    }

    const updated = await CodeAnalysis.findByIdAndUpdate(
      analysisId,
      {
        'reviewerVerification.decision': decision,
        'reviewerVerification.reviewedBy': req.user?.id || null,
        'reviewerVerification.reviewedAt': new Date(),
        'reviewerVerification.notes': notes || '',
        integrityStatus: decision === 'VERIFIED' ? 'VERIFIED' : 'REVIEW_RECOMMENDED',
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
