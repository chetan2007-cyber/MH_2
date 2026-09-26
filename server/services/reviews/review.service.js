const Review = require('../../models/Review');
const Submission = require('../../models/Submission');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const AutomatedCheck = require('../../models/AutomatedCheck');
const DefenseRound = require('../../models/DefenseRound');
const ReviewerProfile = require('../../models/ReviewerProfile');
const CandidateProfile = require('../../models/CandidateProfile');
const capabilityService = require('../capabilities/capability.service');

class ReviewService {
  async getQueue(reviewerId) {
    const submissions = await Submission.find({
      status: { $in: ['UNDER_REVIEW', 'DEFENSE_PENDING', 'VERIFIED'] },
    })
      .populate('challengeId', 'title slug domain difficulty difficultyWeight timeEstimateHours')
      .sort({ updatedAt: -1 });

    const anonymized = await Promise.all(
      submissions.map(async (sub) => {
        const [adrCount, hasAutomatedCheck, defenseRound, existingReviews] = await Promise.all([
          ADR.countDocuments({ submissionId: sub._id }),
          AutomatedCheck.exists({ submissionId: sub._id }),
          DefenseRound.findOne({ submissionId: sub._id }),
          Review.find({ submissionId: sub._id }),
        ]);

        const alreadyReviewedByCurrent = reviewerId
          ? existingReviews.some(
              (r) => r.reviewerId && r.reviewerId.toString() === reviewerId.toString()
            )
          : false;

        return {
          id: sub._id.toString(),
          _id: sub._id.toString(),
          submissionId: sub._id.toString(),
          title: sub.challengeId?.title || 'Distributed Scalable Service',
          candidate: 'Anonymous Candidate',
          candidateName: 'Anonymous Verified Engineer',
          profession: 'Software Developer',
          professionName: 'Software Developer',
          domain: 'Technology',
          domainName: 'Technology',
          difficulty: sub.challengeId?.difficulty || 'Advanced',
          diffColor: '#4f46e5',
          deliverablesSummary: `${adrCount} Architectural Decision Records · Full Hermetic Test Suite · ${existingReviews.length} Calibrated Peer Reviews`,
          challenge: sub.challengeId,
          commitSha: sub.commitSha,
          status: sub.status,
          version: sub.version,
          submittedAt: sub.submittedAt || sub.updatedAt,
          adrCount,
          hasAutomatedCheck: !!hasAutomatedCheck,
          defenseStatus: defenseRound ? defenseRound.status : 'PENDING',
          reviewsCount: existingReviews.length,
          alreadyReviewedByCurrent,
        };
      })
    );

    return anonymized;
  }

  async getSubmissionDossier(submissionId) {
    const submission = await Submission.findById(submissionId).populate('challengeId');
    if (!submission) return null;

    const [project, adrs, automatedCheck, defenseRound, existingReviews] = await Promise.all([
      Project.findOne({ submissionId: submission._id }),
      ADR.find({ submissionId: submission._id }).sort({ decisionIndex: 1 }),
      AutomatedCheck.findOne({ submissionId: submission._id }),
      DefenseRound.findOne({ submissionId: submission._id }),
      Review.find({ submissionId: submission._id }),
    ]);

    return {
      submissionId: submission._id,
      challenge: submission.challengeId,
      commitSha: submission.commitSha,
      repoUrl: submission.repoUrl,
      status: submission.status,
      project,
      adrs,
      automatedCheck,
      defenseRound,
      existingReviewsCount: existingReviews.length,
    };
  }

  async submitRubricReview(submissionId, reviewerId, reviewData) {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found.');

    if (submission.candidateId.toString() === reviewerId.toString()) {
      throw new Error('Conflict of interest: Cannot review own submission.');
    }

    const { rubricScores, qualitativeSynthesis, improvementRecommendations, reviewerConfidence } = reviewData;
    const scores = Object.values(rubricScores || {}).map((item) => item.score || 5);
    const overallScore = Math.round(
      (scores.reduce((a, b) => a + b, 0) / (scores.length || 1)) * 10
    );

    const review = await Review.create({
      submissionId,
      reviewerId,
      candidateId: submission.candidateId,
      challengeId: submission.challengeId,
      rubricScores: rubricScores || {},
      overallScore: Math.min(Math.max(overallScore, 40), 99),
      qualitativeSynthesis: qualitativeSynthesis || 'Competent systems architecture demonstrated.',
      improvementRecommendations: improvementRecommendations || [],
      reviewerConfidence: reviewerConfidence || 5,
    });

    await ReviewerProfile.findOneAndUpdate(
      { userId: reviewerId },
      { $inc: { completedReviewsCount: 1 } }
    );

    await CandidateProfile.findOneAndUpdate(
      { userId: submission.candidateId },
      { $inc: { expertReviewsCount: 1 } }
    );

    if (overallScore >= 70) {
      submission.status = 'VERIFIED';
      submission.verifiedAt = new Date();
      await submission.save();
    }

    await capabilityService.updateCandidateCapabilities(submission.candidateId);
    return review;
  }
}

module.exports = new ReviewService();
