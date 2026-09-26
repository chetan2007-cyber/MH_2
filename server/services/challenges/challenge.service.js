const Challenge = require('../../models/Challenge');
const Submission = require('../../models/Submission');

class ChallengeService {
  async getChallenges(query = {}) {
    const { domain, difficulty, search } = query;
    const filter = {};

    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const challenges = await Challenge.find(filter).sort({ difficultyWeight: 1, createdAt: -1 });
    return challenges;
  }

  async getChallengeBySlug(slug, user) {
    const challenge = await Challenge.findOne({ slug });
    if (!challenge) return null;

    let candidateSubmission = null;
    if (user && user.role === 'CANDIDATE') {
      candidateSubmission = await Submission.findOne({
        candidateId: user._id,
        challengeId: challenge._id,
      }).sort({ createdAt: -1 });
    }

    return { challenge, candidateSubmission };
  }

  async startChallenge(challengeId, user) {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found.');

    let submission = await Submission.findOne({
      candidateId: user._id,
      challengeId: challenge._id,
      status: { $in: ['INITIALIZED', 'BUILDING', 'TESTING', 'DEFENSE_PENDING'] },
    });

    if (submission) {
      return { submission, isExisting: true };
    }

    submission = await Submission.create({
      candidateId: user._id,
      challengeId: challenge._id,
      repoUrl: `https://github.com/${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/${challenge.slug}`,
      commitSha: Math.random().toString(16).substring(2, 10),
      status: 'INITIALIZED',
      preflightChecks: {
        repoValid: true,
        readmeValid: false,
        architectureValid: false,
        adrValid: false,
        testsValid: false,
        defenseValid: false,
        deploymentValid: false,
        explanationValid: false,
      },
    });

    return { submission, isExisting: false };
  }
}

module.exports = new ChallengeService();
