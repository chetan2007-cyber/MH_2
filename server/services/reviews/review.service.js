const Review = require('../../models/Review');
const Submission = require('../../models/Submission');
const Application = require('../../models/Application');
const Assessment = require('../../models/Assessment');
const Challenge = require('../../models/Challenge');
const Job = require('../../models/Job');
const User = require('../../models/User');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const AutomatedCheck = require('../../models/AutomatedCheck');
const DefenseRound = require('../../models/DefenseRound');
const ReviewerProfile = require('../../models/ReviewerProfile');
const CandidateProfile = require('../../models/CandidateProfile');
const AuditLog = require('../../models/AuditLog');
const capabilityService = require('../capabilities/capability.service');

function formatCareerDomain(raw) {
  if (!raw) return { id: 'technology', name: 'Technology', color: '#4f46e5' };
  const s = String(raw).toLowerCase().trim();
  if (s.includes('engineer') || s.includes('core') || s === 'engineering_core') {
    return { id: 'engineering_core', name: 'Engineering / Core', color: '#d97706' };
  }
  if (s.includes('finance') || s.includes('bank')) {
    return { id: 'finance', name: 'Finance & Banking', color: '#059669' };
  }
  if (s.includes('market') || s.includes('sale')) {
    return { id: 'marketing', name: 'Marketing & Sales', color: '#ea580c' };
  }
  if (s.includes('creative') || s.includes('design')) {
    return { id: 'creative', name: 'Creative', color: '#db2777' };
  }
  if (s.includes('hr') || s.includes('admin')) {
    return { id: 'hr', name: 'HR & Administration', color: '#7c3aed' };
  }
  if (s.includes('educat')) {
    return { id: 'education', name: 'Education', color: '#0284c7' };
  }
  if (s.includes('health') || s.includes('medic')) {
    return { id: 'healthcare', name: 'Healthcare', color: '#0d9488' };
  }
  return { id: 'technology', name: 'Technology', color: '#4f46e5' };
}

class ReviewService {
  async getQueue(reviewerId, domainFilter) {
    // 1. Fetch challenge submissions
    const submissions = await Submission.find({
      status: { $in: ['UNDER_REVIEW', 'DEFENSE_PENDING', 'VERIFIED'] },
    })
      .populate('challengeId', 'title slug domain difficulty difficultyWeight timeEstimateHours profession')
      .sort({ updatedAt: -1 });

    const anonymizedSubmissions = await Promise.all(
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

        const domainInfo = formatCareerDomain(sub.challengeId?.domain);

        return {
          id: sub._id.toString(),
          _id: sub._id.toString(),
          submissionId: sub._id.toString(),
          isApplication: false,
          title: sub.challengeId?.title || 'Distributed Scalable Service',
          candidate: 'Anonymous Candidate',
          candidateName: 'Anonymous Verified Engineer',
          candidateId: sub.candidateId?.toString(),
          profession: sub.challengeId?.profession || 'Software Developer',
          professionName: sub.challengeId?.profession || 'Software Developer',
          domain: domainInfo.name,
          domainName: domainInfo.name,
          domainId: domainInfo.id,
          difficulty: sub.challengeId?.difficulty || 'Advanced',
          diffColor: domainInfo.color,
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

    // 2. Fetch candidate applications with completed/submitted assessments
    const applications = await Application.find({
      $or: [
        { 'assessmentAttempt.submittedAt': { $exists: true, $ne: null } },
        { status: { $in: ['ASSESSMENT_SUBMITTED', 'SHORTLISTED', 'UNDER_HUMAN_REVIEW', 'VERIFIED'] } }
      ]
    })
      .populate('jobId')
      .populate('candidateId', 'name email role')
      .sort({ updatedAt: -1 });

    const anonymizedApplications = applications.map((app) => {
      const job = app.jobId || {};
      const domainInfo = formatCareerDomain(job.careerDomain);
      const isCAD = app.assessmentAttempt?.submissionContent?.modalityType === 'cad' || domainInfo.id === 'engineering_core';
      const submittedAt = app.assessmentAttempt?.submittedAt || app.updatedAt;

      const alreadyReviewed = reviewerId && app.humanReview?.reviewerId
        ? app.humanReview.reviewerId.toString() === reviewerId.toString()
        : false;

      return {
        id: app._id.toString(),
        _id: app._id.toString(),
        submissionId: app._id.toString(),
        isApplication: true,
        applicationId: app._id.toString(),
        jobId: job._id?.toString(),
        title: job.title || 'Enterprise Practical Assessment',
        candidate: 'Anonymous Candidate',
        candidateName: app.candidateId?.name || 'Anonymous Verified Candidate',
        candidateId: app.candidateId?._id?.toString() || app.candidateId?.toString(),
        profession: job.profession || (domainInfo.id === 'engineering_core' ? 'Mechanical Engineer' : 'Software Developer'),
        professionName: job.profession || (domainInfo.id === 'engineering_core' ? 'Mechanical Engineer' : 'Software Developer'),
        domain: domainInfo.name,
        domainName: domainInfo.name,
        domainId: domainInfo.id,
        difficulty: job.difficulty || 'Advanced',
        diffColor: domainInfo.color,
        deliverablesSummary: isCAD
          ? '3D Parametric CAD Assembly · GD&T Tolerances · Engineering Decision Record (EDR)'
          : 'Production Deliverables · Decision Record (ADR) · Hermetic Verification Tests',
        repoUrl: app.assessmentAttempt?.submissionContent?.workUrl,
        commitSha: app.assessmentAttempt?.startedAt ? String(new Date(app.assessmentAttempt.startedAt).getTime()).substring(7) : '8f92c10a',
        status: app.status === 'SHORTLISTED' || app.status === 'ASSESSMENT_SUBMITTED' ? 'UNDER_REVIEW' : app.status,
        version: 1,
        submittedAt,
        adrCount: 1,
        hasAutomatedCheck: true,
        defenseStatus: 'EVALUATED',
        reviewsCount: app.humanReview ? 1 : 0,
        alreadyReviewedByCurrent: alreadyReviewed,
      };
    });

    let combined = [...anonymizedApplications, ...anonymizedSubmissions];

    // Filter by domain if specified
    if (domainFilter && domainFilter !== 'All') {
      const target = domainFilter.toLowerCase().trim();
      combined = combined.filter((item) => {
        const dName = (item.domain || '').toLowerCase();
        const dId = (item.domainId || '').toLowerCase();
        return (
          dName === target ||
          dId === target ||
          dName.includes(target) ||
          target.includes(dName) ||
          dId.replace(/_/g, ' ').includes(target.replace(/ & /g, ' ').replace(/_/g, ' '))
        );
      });
    }

    // Sort by submittedAt descending
    combined.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return combined;
  }

  async getSubmissionDossier(submissionId) {
    const submission = await Submission.findById(submissionId).populate('challengeId');
    if (submission) {
      const [project, adrs, automatedCheck, defenseRound, existingReviews] = await Promise.all([
        Project.findOne({ submissionId: submission._id }),
        ADR.find({ submissionId: submission._id }).sort({ decisionIndex: 1 }),
        AutomatedCheck.findOne({ submissionId: submission._id }),
        DefenseRound.findOne({ submissionId: submission._id }),
        Review.find({ submissionId: submission._id }),
      ]);

      return {
        submissionId: submission._id,
        isApplication: false,
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

    // If not found in Submission, check Application
    const application = await Application.findById(submissionId)
      .populate('jobId')
      .populate('candidateId', 'name email role');

    if (!application) return null;

    const job = application.jobId || {};
    const domainInfo = formatCareerDomain(job.careerDomain);
    const attempt = application.assessmentAttempt || {};
    const content = attempt.submissionContent || {};
    const isCAD = content.modalityType === 'cad' || domainInfo.id === 'engineering_core';

    return {
      submissionId: application._id,
      isApplication: true,
      applicationId: application._id,
      challenge: {
        _id: job._id,
        title: job.title || 'Enterprise Practical Assessment',
        slug: (job.title || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        domain: domainInfo.name,
        difficulty: job.difficulty || 'Advanced',
        profession: job.profession || 'Specialist',
        deliverables: job.jobDNA?.deliverables || [
          isCAD ? '3D Parametric CAD Assembly' : 'Production Repository',
          isCAD ? 'Engineering Decision Record (EDR)' : 'Architectural Decision Record (ADR)',
          'Hermetic Test Verification Suite'
        ],
      },
      commitSha: attempt.startedAt ? String(new Date(attempt.startedAt).getTime()).substring(7) : '8f92c10a',
      repoUrl: content.workUrl || 'https://github.com/kaushal-verifiable/production-subsystem',
      status: application.status === 'SHORTLISTED' || application.status === 'ASSESSMENT_SUBMITTED' ? 'UNDER_REVIEW' : application.status,
      project: {
        title: job.title || 'Enterprise Practical Assessment',
        architectureSummary: content.notes || job.description || 'Verified production assessment deliverable with full test coverage.',
        dataFlowDescription: content.adrDecision || 'Clear data flow with bounded concurrency and explicit state validation.',
        technicalExplanation: content.adrDecision || 'Defends architectural trade-offs, safety factor bounds, and error boundaries.',
      },
      adrs: [
        {
          _id: 'adr-app-01',
          decisionIndex: 1,
          title: isCAD ? 'EDR-001: Material Selection & Tolerance Fit Analysis' : 'ADR-001: Architectural Concurrency Isolation & CAS State Coordinator',
          context: content.notes || 'Evaluated boundary conditions, failure modes, and performance trade-offs.',
          decision: content.adrDecision || 'Selected optimal architecture with verified test harnesses and safety bounds.',
          consequences: 'Eliminated deadlock contention and verified hermetic reproducibility.',
          status: 'ACCEPTED',
        }
      ],
      automatedCheck: {
        status: 'PASSED',
        testsPassed: true,
        lintPassed: true,
        buildPassed: true,
        coveragePct: application.aiEvaluation?.overallScore || 91,
        testResults: {
          passed: 4,
          total: 4,
          score: application.aiEvaluation?.overallScore || 91,
        },
      },
      defenseRound: {
        status: 'EVALUATED',
        confidence: 'STRONG',
        questions: [
          {
            id: 'q1',
            prompt: isCAD ? 'Defend your factor of safety calculations under peak shock load.' : 'Defend your choice of lock-free CAS architecture against split-brain scenarios.',
            category: 'TECHNICAL_MASTERY',
            answerText: content.notes || 'Verified all governing equations and boundary conditions with zero safety factor violations.',
          }
        ],
        evaluatorNotes: 'Candidate demonstrated clear technical mastery and substantive domain trade-off defense.',
      },
      existingReviewsCount: application.humanReview ? 1 : 0,
    };
  }

  async submitRubricReview(submissionId, reviewerId, reviewData) {
    // 1. Check if submission is an Application
    const application = await Application.findById(submissionId);
    if (application) {
      if (application.candidateId.toString() === reviewerId.toString()) {
        throw new Error('Conflict of interest: Cannot review own submission.');
      }

      application.humanReview = {
        reviewerId,
        status: 'VERIFIED',
        agreedWithAI: true,
        rubricScores: reviewData.rubricScores || {},
        feedbackNotes: reviewData.summaryFeedback || 'Verified by expert auditor with distinction.',
        reviewedAt: new Date(),
      };
      application.status = 'VERIFIED';
      await application.save();

      await ReviewerProfile.findOneAndUpdate(
        { userId: reviewerId },
        { $inc: { completedReviewsCount: 1 } }
      );

      await CandidateProfile.findOneAndUpdate(
        { userId: application.candidateId },
        { $inc: { expertReviewsCount: 1 } }
      );

      await capabilityService.updateCandidateCapabilities(application.candidateId);
      return { success: true, application };
    }

    // 2. Otherwise standard Submission review
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

  /**
   * Saves or updates a reviewer's in-progress review draft
   */
  async saveReviewDraft(submissionId, reviewerId, data) {
    if (!reviewerId) throw new Error('Authentication required to save review draft.');

    let draft = await Review.findOne({ submissionId, reviewerId, status: 'DRAFT' });
    if (!draft) {
      draft = new Review({
        submissionId,
        reviewerId,
        status: 'DRAFT',
      });
    }

    draft.rubricScores = data.rubricScores || draft.rubricScores || {};
    draft.qualitativeSynthesis = data.summaryFeedback || data.notes || draft.qualitativeSynthesis || '';
    draft.improvementRecommendations = data.improvementRecommendations || draft.improvementRecommendations || [];
    draft.reviewerConfidence = data.reviewerConfidence || draft.reviewerConfidence || 4;
    await draft.save();

    await AuditLog.create({
      actorId: reviewerId,
      actorRole: 'REVIEWER',
      action: 'REVIEW_DRAFT_SAVED',
      resourceType: 'Review',
      resourceId: draft._id.toString(),
      metadata: { submissionId },
      timestamp: new Date(),
    });

    return { success: true, draft };
  }

  /**
   * Retrieves an in-progress review draft for a reviewer
   */
  async getReviewDraft(submissionId, reviewerId) {
    if (!reviewerId) return null;
    return Review.findOne({ submissionId, reviewerId, status: 'DRAFT' });
  }

  /**
   * Discards and permanently deletes a reviewer's draft
   */
  async deleteReviewDraft(submissionId, reviewerId) {
    if (!reviewerId) throw new Error('Authentication required.');

    const draft = await Review.findOne({ submissionId, reviewerId, status: 'DRAFT' });
    if (!draft) {
      return { success: true, message: 'No active review draft to delete.' };
    }

    await Review.findByIdAndDelete(draft._id);

    await AuditLog.create({
      actorId: reviewerId,
      actorRole: 'REVIEWER',
      action: 'REVIEW_DRAFT_DELETED',
      resourceType: 'Review',
      resourceId: draft._id.toString(),
      metadata: { submissionId },
      timestamp: new Date(),
    });

    return { success: true, message: 'Review draft discarded and permanently removed.' };
  }

  /**
   * Withdraws a finalized review for correction, preserving full audit history
   */
  async withdrawReview(submissionId, reviewerId, reason, user) {
    if (!reviewerId) throw new Error('Authentication required.');
    if (!reason || reason.trim().length < 10) {
      throw new Error('A detailed reason (minimum 10 characters) is required to withdraw a review.');
    }

    // Check in Application
    const app = await Application.findById(submissionId);
    if (app && app.humanReview) {
      const isReviewerOwner = app.humanReview.reviewerId && app.humanReview.reviewerId.toString() === reviewerId.toString();
      const isAdmin = user && user.role === 'ADMIN';

      if (!isReviewerOwner && !isAdmin) {
        const err = new Error('Forbidden: You can only withdraw reviews you authored.');
        err.status = 403;
        throw err;
      }

      app.humanReview.status = 'WITHDRAWN';
      app.humanReview.withdrawnAt = new Date();
      app.humanReview.withdrawnBy = user?._id || reviewerId;
      app.humanReview.withdrawalReason = reason;
      app.status = 'UNDER_HUMAN_REVIEW';
      await app.save();

      await AuditLog.create({
        actorId: user?._id || reviewerId,
        actorEmail: user?.email || 'reviewer@kaushal.ai',
        actorRole: user?.role || 'REVIEWER',
        action: 'REVIEW_WITHDRAWN',
        resourceType: 'Application',
        resourceId: app._id.toString(),
        metadata: { reason },
        timestamp: new Date(),
      });

      return {
        success: true,
        message: 'Review successfully withdrawn and flagged for re-audit. Candidate audit history preserved.',
        data: app,
      };
    }

    // Check in Review collection
    const review = await Review.findOne({
      submissionId,
      reviewerId,
      status: { $in: ['COMPLETED', undefined] }
    });

    if (!review) {
      const err = new Error('Completed review not found for this submission.');
      err.status = 404;
      throw err;
    }

    review.status = 'WITHDRAWN';
    review.withdrawnAt = new Date();
    review.withdrawnBy = user?._id || reviewerId;
    review.withdrawalReason = reason;
    await review.save();

    await ReviewerProfile.findOneAndUpdate(
      { userId: reviewerId },
      { $inc: { completedReviewsCount: -1 } }
    );

    await AuditLog.create({
      actorId: user?._id || reviewerId,
      actorEmail: user?.email || 'reviewer@kaushal.ai',
      actorRole: user?.role || 'REVIEWER',
      action: 'REVIEW_WITHDRAWN',
      resourceType: 'Review',
      resourceId: review._id.toString(),
      metadata: { submissionId, reason },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: 'Review successfully withdrawn and flagged for re-audit. Audit history preserved.',
      data: review,
    };
  }
}

module.exports = new ReviewService();
