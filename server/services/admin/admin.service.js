const User = require('../../models/User');
const Challenge = require('../../models/Challenge');
const Submission = require('../../models/Submission');
const Review = require('../../models/Review');
const Opportunity = require('../../models/Opportunity');
const Organization = require('../../models/Organization');
const AuditLog = require('../../models/AuditLog');

class AdminService {
  async getOverview() {
    const [
      totalUsers,
      candidateCount,
      reviewerCount,
      recruiterCount,
      totalChallenges,
      totalSubmissions,
      verifiedSubmissions,
      totalReviews,
      totalOpportunities,
      totalOrgs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'CANDIDATE' }),
      User.countDocuments({ role: 'REVIEWER' }),
      User.countDocuments({ role: 'RECRUITER' }),
      Challenge.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'VERIFIED' }),
      Review.countDocuments(),
      Opportunity.countDocuments(),
      Organization.countDocuments(),
    ]);

    return {
      totalUsers,
      candidateCount,
      reviewerCount,
      recruiterCount,
      totalChallenges,
      totalSubmissions,
      verifiedSubmissions,
      totalReviews,
      totalOpportunities,
      totalOrgs,
    };
  }

  async getUsers() {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    return users;
  }

  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }

    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await user.save();
    return user;
  }

  async getAuditLogs(limit = 150) {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit);
    return logs;
  }
}

module.exports = new AdminService();
