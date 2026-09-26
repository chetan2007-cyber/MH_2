const challengeService = require('../services/challenges/challenge.service');
const { logAudit } = require('../middleware/audit');

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await challengeService.getChallenges(req.query);
    return res.json({ success: true, count: challenges.length, challenges });
  } catch (error) {
    console.error('Get challenges error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving challenges.' });
  }
};

exports.getChallengeBySlug = async (req, res) => {
  try {
    const result = await challengeService.getChallengeBySlug(req.params.slug, req.user);
    if (!result) return res.status(404).json({ success: false, error: 'Challenge not found.' });
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Get challenge by slug error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving challenge details.' });
  }
};

exports.startChallenge = async (req, res) => {
  try {
    const { submission, isExisting } = await challengeService.startChallenge(req.params.challengeId, req.user);

    if (!isExisting) {
      await logAudit({
        actorId: req.user._id,
        actorEmail: req.user.email,
        actorRole: req.user.role,
        action: 'CHALLENGE_STARTED',
        resourceType: 'Submission',
        resourceId: submission._id.toString(),
        metadata: { challengeId: req.params.challengeId },
      });
    }

    return res.json({
      success: true,
      message: isExisting ? 'Active workspace already provisioned.' : 'Challenge workspace initialized successfully.',
      submission,
    });
  } catch (error) {
    console.error('Start challenge error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error starting challenge.' });
  }
};
