const reviewService = require('../services/reviews/review.service');
const { logAudit } = require('../middleware/audit');

exports.getReviewQueue = async (req, res) => {
  try {
    const queue = await reviewService.getQueue(req.user?._id, req.query.domain);
    return res.json({ success: true, count: queue.length, data: queue, queue });
  } catch (error) {
    console.error('Get review queue error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving review queue.' });
  }
};

exports.getSubmissionForReview = async (req, res) => {
  try {
    const dossier = await reviewService.getSubmissionDossier(req.params.submissionId);
    if (!dossier) return res.status(404).json({ success: false, error: 'Submission not found.' });
    return res.json({ success: true, dossier });
  } catch (error) {
    console.error('Get submission for review error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving review dossier.' });
  }
};

const ReviewerProfile = require('../models/ReviewerProfile');
const User = require('../models/User');
const Submission = require('../models/Submission');

exports.submitReview = async (req, res) => {
  try {
    let reviewerId = req.user?._id;
    let reviewerEmail = req.user?.email || 'reviewer@kaushal.ai';
    let reviewerRole = req.user?.role || 'REVIEWER';

    if (!reviewerId) {
      const submission = await Submission.findById(req.params.submissionId);
      const revProfile = await ReviewerProfile.findOne({
        ...(submission ? { userId: { $ne: submission.candidateId } } : {})
      });
      reviewerId = revProfile ? revProfile.userId : null;
      if (!reviewerId) {
        const revUser = await User.findOne({
          role: 'REVIEWER',
          ...(submission ? { _id: { $ne: submission.candidateId } } : {})
        });
        reviewerId = revUser ? revUser._id : null;
      }
    }

    if (!reviewerId) {
      return res.status(400).json({ success: false, error: 'No active reviewer identity found.' });
    }

    const review = await reviewService.submitRubricReview(req.params.submissionId, reviewerId, req.body);

    await logAudit({
      actorId: reviewerId,
      actorEmail: reviewerEmail,
      actorRole: reviewerRole,
      action: 'REVIEW_SUBMITTED',
      resourceType: 'Review',
      resourceId: review._id.toString(),
      metadata: { overallScore: review.overallScore },
    });

    return res.status(201).json({
      success: true,
      message: 'Double-blind expert review submitted successfully. Capability vectors updated.',
      review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(400).json({ success: false, error: error.message || 'Error submitting review.' });
  }
};

exports.saveReviewDraft = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const result = await reviewService.saveReviewDraft(req.params.submissionId, reviewerId, req.body);
    res.json(result);
  } catch (error) {
    console.error('Save review draft error:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

exports.getReviewDraft = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) return res.json({ success: true, draft: null });

    const draft = await reviewService.getReviewDraft(req.params.submissionId, reviewerId);
    res.json({ success: true, draft });
  } catch (error) {
    console.error('Get review draft error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteReviewDraft = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const result = await reviewService.deleteReviewDraft(req.params.submissionId, reviewerId);
    res.json(result);
  } catch (error) {
    console.error('Delete review draft error:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

exports.withdrawReview = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const result = await reviewService.withdrawReview(
      req.params.submissionId,
      reviewerId,
      req.body.reason,
      req.user
    );
    res.json(result);
  } catch (error) {
    console.error('Withdraw review error:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};
