const Opportunity = require('../../models/Opportunity');
const RecruiterProfile = require('../../models/RecruiterProfile');
const User = require('../../models/User');

class OpportunityService {
  async sendOpportunity(recruiterUserId, data) {
    const {
      candidateId,
      roleTitle,
      compensationRange,
      locationType,
      whyReachedOut,
      skillsMatched,
      referencedProjectIds,
    } = data;

    const whyMsg = whyReachedOut || data.message || 'Direct outreach based on verified proof and decision records.';

    if (!candidateId || !roleTitle) {
      throw new Error('Candidate ID and role title are required.');
    }

    let recruiterProfile = await RecruiterProfile.findOne({ userId: recruiterUserId });
    if (!recruiterProfile) {
      recruiterProfile = await RecruiterProfile.findOne();
    }
    if (!recruiterProfile) {
      const err = new Error('No recruiter profile available.');
      err.status = 403;
      throw err;
    }

    const candidate = await User.findById(candidateId);
    if (!candidate) {
      const err = new Error('Candidate not found.');
      err.status = 404;
      throw err;
    }

    const opportunity = await Opportunity.create({
      recruiterId: recruiterProfile.userId,
      candidateId,
      organizationId: recruiterProfile.organizationId,
      roleTitle,
      compensationRange: compensationRange || '$150k - $210k + Equity',
      locationType: locationType || 'Remote (Global)',
      whyReachedOut: whyMsg,
      skillsMatched: Array.isArray(skillsMatched) ? skillsMatched : ['Distributed Systems', 'PostgreSQL'],
      referencedProjectIds: Array.isArray(referencedProjectIds) ? referencedProjectIds : [],
      status: 'SENT',
    });

    recruiterProfile.opportunitiesSentCount += 1;
    await recruiterProfile.save();

    return opportunity;
  }

  async getOpportunities(user) {
    const filter = {};
    if (user.role === 'CANDIDATE') {
      filter.candidateId = user._id;
    } else if (user.role === 'RECRUITER') {
      filter.recruiterId = user._id;
    }

    const opportunities = await Opportunity.find(filter)
      .populate('organizationId', 'name slug domain verified logoUrl')
      .populate('candidateId', 'name email')
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    return opportunities;
  }

  async respondToOpportunity(opportunityId, candidateId, action, message) {
    const validActions = ['ACCEPTED', 'DECLINED', 'QUESTION_ASKED'];
    if (!validActions.includes(action)) {
      throw new Error('Invalid response action.');
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      const err = new Error('Opportunity not found.');
      err.status = 404;
      throw err;
    }

    if (opportunity.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized to respond to this opportunity.');
      err.status = 403;
      throw err;
    }

    opportunity.status = action;
    opportunity.respondedAt = new Date();
    if (message) {
      opportunity.candidateResponseNotes = message;
    }
    await opportunity.save();
    return opportunity;
  }
}

module.exports = new OpportunityService();
