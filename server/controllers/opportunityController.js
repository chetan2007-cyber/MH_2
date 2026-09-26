const opportunityService = require('../services/opportunities/opportunity.service');
const { logAudit } = require('../middleware/audit');

exports.sendOpportunity = async (req, res) => {
  try {
    const actorId = req.user?._id || '6ab7d20aa9d8609e06dd593f';
    const actorEmail = req.user?.email || 'recruiter@proofline.dev';
    const actorRole = req.user?.role || 'RECRUITER';

    const opportunity = await opportunityService.sendOpportunity(actorId, req.body);

    await logAudit({
      actorId,
      actorEmail,
      actorRole,
      action: 'OPPORTUNITY_CREATED',
      resourceType: 'Opportunity',
      resourceId: opportunity._id.toString(),
      metadata: { candidateId: opportunity.candidateId, roleTitle: opportunity.roleTitle },
    });

    return res.status(201).json({
      success: true,
      message: 'Verified evidence-backed opportunity sent directly to candidate dashboard.',
      opportunity,
      data: opportunity,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Error sending opportunity.' });
  }
};

exports.getOpportunities = async (req, res) => {
  try {
    const user = req.user || { role: 'RECRUITER' };
    const opportunities = await opportunityService.getOpportunities(user);
    return res.json({ success: true, count: opportunities.length, data: opportunities, opportunities });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error retrieving opportunities.' });
  }
};

exports.respondToOpportunity = async (req, res) => {
  try {
    const action = req.body.action || req.body.status;
    const message = req.body.message || req.body.candidateResponseNotes || req.body.notes;
    const opportunity = await opportunityService.respondToOpportunity(req.params.opportunityId, req.user._id, action, message);

    await logAudit({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: `OPPORTUNITY_${action}`,
      resourceType: 'Opportunity',
      resourceId: opportunity._id.toString(),
    });

    return res.json({ success: true, message: `Opportunity status updated to ${action}.`, opportunity });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Error responding to opportunity.' });
  }
};
