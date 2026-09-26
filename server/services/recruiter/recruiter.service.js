const User = require('../../models/User');
const CandidateProfile = require('../../models/CandidateProfile');
const CapabilityScore = require('../../models/CapabilityScore');
const Submission = require('../../models/Submission');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const AutomatedCheck = require('../../models/AutomatedCheck');
const Review = require('../../models/Review');
const RecruiterProfile = require('../../models/RecruiterProfile');

class RecruiterService {
  async discoverCandidates(query) {
    const { skills, minScore, dimension, confidence, difficulty, search } = query;

    const candidateFilter = { role: 'CANDIDATE', status: 'ACTIVE' };
    if (search) {
      candidateFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const candidates = await User.find(candidateFilter).select('name email createdAt');
    const results = [];

    for (const c of candidates) {
      const profile = await CandidateProfile.findOne({ userId: c._id });

      const capQuery = { candidateId: c._id, status: 'VERIFIED' };
      if (dimension) capQuery.dimension = dimension;
      if (minScore) capQuery.score = { $gte: Number(minScore) };
      if (confidence) capQuery.confidence = confidence;

      const matchedScores = await CapabilityScore.find(capQuery);
      const allScores = await CapabilityScore.find({ candidateId: c._id, status: 'VERIFIED' }).sort({ score: -1 });

      if ((dimension || minScore) && matchedScores.length === 0) continue;

      if (skills && profile) {
        const reqSkills = skills.split(',').map((s) => s.trim().toLowerCase());
        const hasSkill = profile.skills?.some((sk) => reqSkills.includes(sk.toLowerCase()));
        if (!hasSkill) continue;
      }

      const verifiedSubs = await Submission.find({
        candidateId: c._id,
        status: { $in: ['VERIFIED', 'UNDER_REVIEW'] },
      }).populate('challengeId');

      if (difficulty && verifiedSubs.length > 0) {
        const matchesDiff = verifiedSubs.some((s) => s.challengeId?.difficulty === difficulty);
        if (!matchesDiff) continue;
      }

      let latestProof = null;
      if (verifiedSubs.length > 0) {
        const latestSub = verifiedSubs[0];
        const [proj, autoCheck, adrCount, reviewCount] = await Promise.all([
          Project.findOne({ submissionId: latestSub._id }),
          AutomatedCheck.findOne({ submissionId: latestSub._id }),
          ADR.countDocuments({ submissionId: latestSub._id }),
          Review.countDocuments({ submissionId: latestSub._id }),
        ]);

        latestProof = {
          challengeTitle: latestSub.challengeId?.title || 'System Implementation',
          difficulty: latestSub.challengeId?.difficulty || 'PRODUCTION',
          domain: latestSub.challengeId?.domain || 'BACKEND',
          techStack: proj?.techStack || ['Node.js', 'PostgreSQL'],
          p99LatencyMs: autoCheck?.p99LatencyMs || 2.4,
          passRate: autoCheck?.passRate || 100,
          adrsCount: adrCount,
          reviewsCount: reviewCount,
        };
      }

      results.push({
        candidateId: c._id,
        name: c.name,
        headline: profile?.headline || 'Systems & Backend Engineer',
        location: profile?.location || 'Remote',
        proofConfidence: profile?.proofConfidence || 'HIGH',
        verificationLevel: profile?.verificationLevel || 'CHAOS_VERIFIED',
        capabilities: allScores.map((s) => ({
          dimension: s.dimension,
          displayName: s.displayName,
          score: s.score,
          confidence: s.confidence,
        })),
        skills: profile?.skills || [],
        latestProof,
      });
    }

    return results;
  }

  async toggleSaveCandidate(recruiterId, candidateId) {
    const recruiterProfile = await RecruiterProfile.findOne({ userId: recruiterId });
    if (!recruiterProfile) throw new Error('Recruiter profile not found.');

    const isSaved = recruiterProfile.savedCandidateIds?.some((id) => id.toString() === candidateId);
    let updated;
    if (isSaved) {
      updated = await RecruiterProfile.findOneAndUpdate(
        { userId: recruiterId },
        { $pull: { savedCandidateIds: candidateId } },
        { new: true }
      );
    } else {
      updated = await RecruiterProfile.findOneAndUpdate(
        { userId: recruiterId },
        { $addToSet: { savedCandidateIds: candidateId } },
        { new: true }
      );
    }
    return !isSaved;
  }
}

module.exports = new RecruiterService();
