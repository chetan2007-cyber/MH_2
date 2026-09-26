const defenseService = require('../services/defense/defense.service');
const { logAudit } = require('../middleware/audit');

exports.getDefenseRound = async (req, res) => {
  try {
    const defenseRound = await defenseService.getDefenseRound(req.params.submissionId);
    if (!defenseRound) return res.status(404).json({ success: false, error: 'Defense Round not found for this submission.' });

    if (req.user.role === 'CANDIDATE' && defenseRound.candidateId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view this defense round.' });
    }

    return res.json({ success: true, defenseRound });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error retrieving defense round.' });
  }
};

exports.submitDefenseAnswers = async (req, res) => {
  try {
    const defenseRound = await defenseService.submitAnswers(req.params.submissionId, req.user._id, req.body.answers);

    await logAudit({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: 'DEFENSE_ROUND_COMPLETED',
      resourceType: 'DefenseRound',
      resourceId: defenseRound._id.toString(),
      metadata: { confidence: 'STRONG' },
    });

    return res.json({
      success: true,
      message: 'Defense Round™ completed! Your submission is now in the double-blind review queue.',
      defenseRound,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Server error processing defense submission.' });
  }
};
