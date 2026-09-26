const Interview = require('../../models/Interview');
const Application = require('../../models/Application');
const Job = require('../../models/Job');
const AuditLog = require('../../models/AuditLog');
const Notification = require('../../models/Notification');

class InterviewService {
  async generateInterviewQuestions(applicationId, user) {
    const application = await Application.findById(applicationId)
      .populate('candidateId')
      .populate('jobId');
    if (!application) throw new Error('Application not found');

    const job = application.jobId;
    const domain = job.careerDomain || 'technology';
    const profession = job.profession || 'Software Developer';

    const questions = [
      {
        id: 'q1',
        question: `In your practical assessment submission for ${job.title}, what architectural trade-offs did you weigh when selecting your core concurrency/load coordination mechanism?`,
        competency: 'System Architecture & Decision Rigor',
        difficulty: 'Advanced',
        evidenceContext: `Assessment ADR: ${application.assessmentAttempt?.submissionContent?.adrDecision || 'Selected atomic state coordination over distributed table locks.'}`,
        evaluatorFocus: 'Check if candidate explains secondary failure modes, latency implications, and rollback mechanisms.',
        sampleGoodAnswer: 'Articulates throughput bottleneck analysis and explains why memory-level atomicity was chosen despite cache eviction constraints.',
      },
      {
        id: 'q2',
        question: `How did you verify that your test suite was hermetic and prevented race conditions under peak simulated traffic?`,
        competency: 'Verification & Test Depth',
        difficulty: 'Advanced',
        evidenceContext: 'Assessment Test Run: 100% Hermetic pass score across 4 fuzzing suites.',
        evaluatorFocus: 'Evaluate understanding of race condition detectors, mock boundaries, and deterministic seed generation.',
        sampleGoodAnswer: 'Explains setup of isolated containerized environments and automated race detection flags during build.',
      },
      {
        id: 'q3',
        question: `If the system throughput increases by 10x, what is the first component that will saturate, and how would you evolve the design?`,
        competency: 'Scalability & Resilience',
        difficulty: 'Expert',
        evidenceContext: 'Role Fit Score: 93% on Scalability dimension.',
        evaluatorFocus: 'Look for pragmatic horizontal partitioning or sharding strategies rather than hand-waving.',
        sampleGoodAnswer: 'Identifies specific lock contention points and outlines transition to partitioned ring topology.',
      },
      {
        id: 'q4',
        question: `Can you walk us through how you handled error propagation and fault tolerance in your edge case handling?`,
        competency: 'Error Resilience & Code Craft',
        difficulty: 'Proficient',
        evidenceContext: 'AI Evaluation: Verified zero unhandled exceptions.',
        evaluatorFocus: 'Assess structured error types, retries with exponential backoff, and circuit breaker implementation.',
        sampleGoodAnswer: 'Describes structured domain errors, contextual error wrapping, and dead-letter queue routing.',
      },
    ];

    return {
      applicationId: application._id,
      candidate: {
        id: application.candidateId._id,
        name: application.candidateId.name,
        profession: application.candidateId.profession || profession,
      },
      job: {
        id: job._id,
        title: job.title,
        department: job.department,
      },
      questions,
    };
  }

  async scheduleInterview(data, recruiter) {
    const application = await Application.findById(data.applicationId);
    if (!application) throw new Error('Application not found');

    const generated = await this.generateInterviewQuestions(data.applicationId, recruiter);

    const interview = new Interview({
      applicationId: application._id,
      candidateId: application.candidateId,
      jobId: application.jobId,
      scheduledAt: data.scheduledAt || new Date(Date.now() + 86400000),
      durationMinutes: data.durationMinutes || 45,
      status: 'SCHEDULED',
      generatedQuestions: data.questions || generated.questions,
      scorecard: [
        { criterionId: 'tech_depth', label: 'Technical Depth & Domain Rigor', score: 4, notes: '' },
        { criterionId: 'prob_solving', label: 'Practical Problem Solving & Trade-offs', score: 4, notes: '' },
        { criterionId: 'communication', label: 'Technical Conviction & Clarity', score: 4, notes: '' },
        { criterionId: 'role_fit', label: 'Role Alignment & Scalability', score: 4, notes: '' },
      ],
      interviewerId: recruiter?._id || application.candidateId,
    });

    await interview.save();

    // Update application status
    application.status = 'INTERVIEW_SCHEDULED';
    await application.save();

    await AuditLog.create({
      actorId: recruiter?._id || application.candidateId,
      actorEmail: recruiter?.email || 'recruiter@proofline.dev',
      actorRole: recruiter?.role || 'RECRUITER',
      action: 'INTERVIEW_SCHEDULED',
      resourceType: 'Interview',
      resourceId: interview._id.toString(),
      metadata: { applicationId: application._id.toString(), scheduledAt: interview.scheduledAt },
    });

    await Notification.create({
      userId: application.candidateId,
      title: 'Interview Scheduled',
      message: `Your technical defense interview has been scheduled for ${new Date(interview.scheduledAt).toLocaleString()}.`,
      type: 'INTERVIEW',
      link: '/workspace',
    });

    return interview;
  }

  async getInterviewByApplication(applicationId) {
    return Interview.findOne({ applicationId })
      .populate('candidateId', 'name email role profession avatar')
      .populate('jobId', 'title department')
      .populate('interviewerId', 'name email role');
  }

  async submitScorecard(interviewId, scorecardData, interviewer) {
    const interview = await Interview.findById(interviewId);
    if (!interview) throw new Error('Interview not found');

    if (scorecardData.scorecard) interview.scorecard = scorecardData.scorecard;
    if (scorecardData.interviewerNotes) interview.interviewerNotes = scorecardData.interviewerNotes;
    if (scorecardData.recommendation) interview.recommendation = scorecardData.recommendation;
    interview.status = 'COMPLETED';
    interview.completedAt = new Date();

    await interview.save();

    await AuditLog.create({
      actorId: interviewer._id,
      actorEmail: interviewer.email,
      actorRole: interviewer.role,
      action: 'INTERVIEW_SCORECARD_SUBMITTED',
      resourceType: 'Interview',
      resourceId: interview._id.toString(),
      metadata: { recommendation: interview.recommendation },
    });

    return interview;
  }
}

module.exports = new InterviewService();
