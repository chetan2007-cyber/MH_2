const trustService = require('../services/trust/trust.service');

exports.getTrustSignals = async (req, res) => {
  try {
    const candidateId = req.params.candidateId || req.user._id;
    const trustSummary = await trustService.getSignals(candidateId);
    return res.json({ success: true, trustSummary });
  } catch (error) {
    console.error('Get trust signals error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving trust signals.' });
  }
};
