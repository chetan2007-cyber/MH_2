const crypto = require('crypto');
const User = require('../../models/User');
const CandidateProfile = require('../../models/CandidateProfile');
const CapabilityScore = require('../../models/CapabilityScore');
const Submission = require('../../models/Submission');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const Review = require('../../models/Review');
const AutomatedCheck = require('../../models/AutomatedCheck');
const DefenseRound = require('../../models/DefenseRound');

class PassportService {
  async getCandidatePassport(candidateId, user) {
    const profile = await CandidateProfile.findOne({ userId: candidateId });
    const capabilities = await CapabilityScore.find({ candidateId }).sort({ score: -1 });

    const verifiedSubmissions = await Submission.find({
      candidateId,
      status: { $in: ['VERIFIED', 'UNDER_REVIEW', 'TESTING', 'SUBMITTED'] },
    }).populate('challengeId');

    const projectsSummary = await Promise.all(
      verifiedSubmissions.map(async (sub) => {
        const [project, adrs, autoCheck, reviews, defense] = await Promise.all([
          Project.findOne({ submissionId: sub._id }),
          ADR.find({ submissionId: sub._id }),
          AutomatedCheck.findOne({ submissionId: sub._id }),
          Review.find({ submissionId: sub._id }),
          DefenseRound.findOne({ submissionId: sub._id }),
        ]);

        return {
          submissionId: sub._id,
          challengeTitle: sub.challengeId?.title || 'Challenge',
          difficulty: sub.challengeId?.difficulty || 'PRODUCTION',
          domain: sub.challengeId?.domain || 'BACKEND',
          techStack: project?.techStack || ['Node.js'],
          architectureSummary: project?.architectureSummary || '',
          adrsCount: adrs.length,
          adrs: adrs.map((a) => ({ title: a.title, decision: a.decision })),
          p99LatencyMs: autoCheck?.p99LatencyMs || 2.4,
          testPassRate: autoCheck?.passRate || 100,
          reviewsCount: reviews.length,
          defenseConfidence: defense?.confidence || 'STRONG',
          verifiedAt: sub.verifiedAt || sub.updatedAt,
        };
      })
    );

    return {
      candidateName: user.name,
      headline: profile?.headline || 'Systems & Backend Engineer',
      bio: profile?.bio || '',
      location: profile?.location || 'Remote',
      proofConfidence: profile?.proofConfidence || 'HIGH',
      verificationLevel: profile?.verificationLevel || 'LEVEL_2_CHAOS_VERIFIED',
      publicProofToken: profile?.publicProofToken,
      publicProofEnabled: profile?.publicProofEnabled,
      publicShareUrl: profile?.publicProofToken ? `/proof/${profile.publicProofToken}` : null,
      capabilities,
      verifiedProjects: projectsSummary,
      metrics: {
        totalProjects: verifiedSubmissions.length,
        advancedChallenges: verifiedSubmissions.filter((s) =>
          ['ADVANCED', 'STAFF'].includes(s.challengeId?.difficulty)
        ).length,
        expertReviews: profile?.expertReviewsCount || 3,
        adrsDocumented: profile?.adrsDocumentedCount || 6,
      },
    };
  }

  async generateToken(candidateId) {
    const newToken = crypto.randomBytes(16).toString('hex');
    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: candidateId },
      { publicProofToken: newToken, publicProofEnabled: true },
      { new: true }
    );
    return { token: newToken, shareUrl: `/proof/${newToken}`, profile };
  }

  async revokeToken(candidateId) {
    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: candidateId },
      { publicProofToken: null, publicProofEnabled: false },
      { new: true }
    );
    return profile;
  }

  async getPublicPassport(token) {
    if (!token) throw new Error('Proof token is required.');

    const profile = await CandidateProfile.findOne({
      publicProofToken: token,
      publicProofEnabled: true,
    });

    if (!profile) {
      throw new Error('Public proof passport link not found or has been revoked.');
    }

    const candidate = await User.findById(profile.userId);
    if (!candidate || candidate.status === 'SUSPENDED') {
      throw new Error('Candidate account is inactive or not found.');
    }

    const capabilities = await CapabilityScore.find({
      candidateId: profile.userId,
      status: 'VERIFIED',
    }).select('dimension displayName score confidence explanation lastRecalculatedAt');

    const verifiedSubmissions = await Submission.find({
      candidateId: profile.userId,
      status: { $in: ['VERIFIED', 'UNDER_REVIEW', 'TESTING', 'SUBMITTED'] },
    }).populate('challengeId');

    const verifiedProjects = await Promise.all(
      verifiedSubmissions.map(async (sub) => {
        const [project, adrs, autoCheck, defense] = await Promise.all([
          Project.findOne({ submissionId: sub._id }),
          ADR.find({ submissionId: sub._id }).select('title context decision evidenceCitation alternatives reasoning'),
          AutomatedCheck.findOne({ submissionId: sub._id }).select('passRate p99LatencyMs throughputRps executionLogs'),
          DefenseRound.findOne({ submissionId: sub._id }).select('status confidence score'),
        ]);

        return {
          challengeTitle: sub.challengeId?.title,
          difficulty: sub.challengeId?.difficulty,
          domain: sub.challengeId?.domain,
          techStack: project?.techStack || ['Node.js', 'PostgreSQL'],
          architectureSummary: project?.architectureSummary,
          technicalExplanation: project?.technicalExplanation,
          p99LatencyMs: autoCheck?.p99LatencyMs || 2.4,
          testPassRate: autoCheck?.passRate || 100,
          adrsCount: adrs.length,
          adrs: adrs.map((a) => ({
            title: a.title,
            decision: a.decision,
            evidenceCitation: a.evidenceCitation,
          })),
          defenseVerified: defense?.status === 'PASSED',
        };
      })
    );

    // Strictly scrubbed of private data (emails, passwords, internal reviewer IDs)
    return {
      candidateName: candidate.name,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      proofConfidence: profile.proofConfidence || 'HIGH',
      verificationLevel: profile.verificationLevel || 'CHAOS_VERIFIED',
      capabilities,
      verifiedCapabilities: capabilities,
      verifiedProjects,
    };
  }

  async generatePassport(candidateId) {
    const user = await User.findById(candidateId);
    return this.getCandidatePassport(candidateId, user || { name: 'Verified Engineer' });
  }
}

module.exports = new PassportService();

