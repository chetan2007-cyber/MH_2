const passportService = require('../services/proofpassport/passport.service');
const { logAudit } = require('../middleware/audit');

exports.getMyPassport = async (req, res) => {
  try {
    const passport = await passportService.getCandidatePassport(req.user._id, req.user);
    return res.json({ success: true, passport });
  } catch (error) {
    console.error('Get passport error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving Proof Passport.' });
  }
};

exports.generatePublicProofToken = async (req, res) => {
  try {
    const { token, shareUrl } = await passportService.generateToken(req.user._id);

    await logAudit({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: 'PUBLIC_PROOF_CREATED',
      resourceType: 'ProofPassport',
      resourceId: req.user._id.toString(),
      metadata: { publicProofToken: token },
    });

    return res.json({ success: true, message: 'Public Proof Passport link created.', token, shareUrl });
  } catch (error) {
    console.error('Generate proof token error:', error);
    return res.status(500).json({ success: false, error: 'Error generating public proof link.' });
  }
};

exports.revokePublicProofToken = async (req, res) => {
  try {
    await passportService.revokeToken(req.user._id);

    await logAudit({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: 'PUBLIC_PROOF_REVOKED',
      resourceType: 'ProofPassport',
      resourceId: req.user._id.toString(),
    });

    return res.json({ success: true, message: 'Public proof passport link has been revoked.' });
  } catch (error) {
    console.error('Revoke proof token error:', error);
    return res.status(500).json({ success: false, error: 'Error revoking public proof link.' });
  }
};

exports.getPublicProof = async (req, res) => {
  try {
    const publicPassport = await passportService.getPublicPassport(req.params.token);
    return res.json({ success: true, publicPassport });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

// Aliases
exports.getPublicProofByToken = exports.getPublicProof;

