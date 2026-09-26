const capabilityService = require('../services/capabilities/capability.service');

const CandidateProfile = require('../models/CandidateProfile');

exports.getMyCapabilities = async (req, res) => {
  try {
    let candidateId = req.user?._id;
    if (!candidateId) {
      const candidate = await CandidateProfile.findOne();
      candidateId = candidate ? candidate.userId : null;
    }
    if (!candidateId) {
      return res.json({ success: true, capabilities: [] });
    }
    const capabilities = await capabilityService.getCandidateCapabilities(candidateId);
    return res.json({ success: true, capabilities });
  } catch (error) {
    console.error('Get my capabilities error:', error);
    return res.status(500).json({ success: false, error: 'Error calculating capability vectors.' });
  }
};

exports.getCandidateCapabilities = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const capabilities = await capabilityService.getCandidateCapabilities(candidateId);
    return res.json({ success: true, capabilities });
  } catch (error) {
    console.error('Get candidate capabilities error:', error);
    return res.status(500).json({ success: false, error: 'Error fetching candidate capability vectors.' });
  }
};

exports.getScoreExplanation = async (req, res) => {
  try {
    const { candidateId, dimension } = req.params;
    const targetId = candidateId === 'me' ? req.user._id : candidateId;
    const cap = await capabilityService.getScoreExplanation(targetId, dimension);

    if (!cap) {
      return res.status(404).json({ success: false, error: 'Dimension not found or insufficient evidence.' });
    }

    return res.json({
      success: true,
      dimension: cap.dimension,
      displayName: cap.displayName,
      score: cap.score,
      status: cap.status,
      confidence: cap.confidence,
      explanation: cap.explanation,
    });
  } catch (error) {
    console.error('Score explanation error:', error);
    return res.status(500).json({ success: false, error: 'Error calculating score explanation.' });
  }
};
