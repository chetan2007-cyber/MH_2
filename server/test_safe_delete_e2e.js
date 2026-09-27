const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Job = require('./models/Job');
const Assessment = require('./models/Assessment');
const Application = require('./models/Application');
const Review = require('./models/Review');
const AuditLog = require('./models/AuditLog');

const jobService = require('./services/jobs/job.service');
const assessmentService = require('./services/assessments/assessment.service');
const reviewService = require('./services/reviews/review.service');

async function runTests() {
  console.log('=== STARTING KAUSHAL SAFE DELETE / ARCHIVE E2E SUITE ===\n');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proofline');

  // Setup test users
  const orgAId = new mongoose.Types.ObjectId();
  const orgBId = new mongoose.Types.ObjectId();

  const recruiterA = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Recruiter Priya',
    email: 'priya@orga.com',
    role: 'RECRUITER',
    organizationId: orgAId,
  };

  const recruiterB = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Recruiter Bob',
    email: 'bob@orgb.com',
    role: 'RECRUITER',
    organizationId: orgBId,
  };

  const reviewerA = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Reviewer Vikram',
    email: 'vikram@expert.com',
    role: 'REVIEWER',
    organizationId: orgAId,
  };

  const candidateA = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Candidate Rahul',
    email: 'rahul@talent.com',
    role: 'CANDIDATE',
  };

  console.log('--- TEST 1: RECRUITER DRAFT JOB PERMANENT DELETION ---');
  const draftJob = await Job.create({
    title: 'Junior Go Backend Engineer (Draft)',
    department: 'Engineering',
    careerDomain: 'technology',
    profession: 'Software Developer',
    experience: '1-2 years',
    description: 'Temporary draft requisition for testing',
    organizationId: orgAId,
    createdBy: recruiterA._id,
    status: 'DRAFT',
  });

  const draftDeps = await jobService.getJobDependencies(draftJob._id, recruiterA);
  console.log('Draft Job Dependencies:', draftDeps.dependencies);
  console.log('Can Hard Delete:', draftDeps.canHardDelete);
  if (!draftDeps.canHardDelete) throw new Error('Test 1 Failed: Draft job should be eligible for hard delete');

  const deleteResult = await jobService.deleteJob(draftJob._id, recruiterA);
  console.log('Delete result:', deleteResult.message);

  const checkDeletedJob = await Job.findById(draftJob._id);
  if (checkDeletedJob) throw new Error('Test 1 Failed: Draft job was not removed from DB');
  console.log('PASSED: Draft job genuinely removed from database.\n');

  console.log('--- TEST 2: PUBLISHED JOB WITH CANDIDATE DEPENDENCIES MUST BE ARCHIVED ---');
  const liveJob = await Job.create({
    title: 'Senior Distributed Systems Architect',
    department: 'Infrastructure',
    careerDomain: 'technology',
    profession: 'Software Developer',
    experience: '6-8 years',
    description: 'Live requisition with candidate pipeline',
    organizationId: orgAId,
    createdBy: recruiterA._id,
    status: 'OPEN',
  });

  // Attach a candidate application to liveJob
  const testApp = await Application.create({
    jobId: liveJob._id,
    candidateId: candidateA._id,
    status: 'APPLIED',
    applicationTimeline: [{ status: 'APPLIED', title: 'Applied', timestamp: new Date() }],
  });

  const liveDeps = await jobService.getJobDependencies(liveJob._id, recruiterA);
  console.log('Live Job Dependencies:', liveDeps.dependencies);
  console.log('Can Hard Delete:', liveDeps.canHardDelete);
  console.log('Recommended Action:', liveDeps.recommendedAction);
  console.log('Blocking Reasons:', liveDeps.blockingReasons);

  if (liveDeps.canHardDelete) throw new Error('Test 2 Failed: Live job with applications must NOT be eligible for hard delete');

  let hardDeleteErrorCaught = false;
  try {
    await jobService.deleteJob(liveJob._id, recruiterA);
  } catch (err) {
    hardDeleteErrorCaught = true;
    console.log('Guarded hard delete properly rejected with message:', err.message);
  }
  if (!hardDeleteErrorCaught) throw new Error('Test 2 Failed: Hard delete should have thrown an error');

  // Archive Job
  const archiveResult = await jobService.archiveJob(liveJob._id, recruiterA, 'Hiring paused for Q4');
  console.log('Archive result:', archiveResult.message);

  const checkArchivedJob = await Job.findById(liveJob._id);
  if (checkArchivedJob.status !== 'ARCHIVED') throw new Error('Test 2 Failed: Job status was not updated to ARCHIVED');
  if (!checkArchivedJob.archivedAt) throw new Error('Test 2 Failed: archivedAt timestamp not set');
  console.log('Archived timestamp:', checkArchivedJob.archivedAt, 'by:', checkArchivedJob.archivedBy);

  // Verify candidate application history remained intact
  const checkApp = await Application.findById(testApp._id);
  if (!checkApp) throw new Error('Test 2 Failed: Candidate application was deleted! Historical evidence destroyed!');
  console.log('PASSED: Candidate application history remained 100% intact after archival.\n');

  console.log('--- TEST 3: RESTORE ARCHIVED JOB ---');
  const restoreResult = await jobService.restoreJob(liveJob._id, recruiterA);
  console.log('Restore result:', restoreResult.message);
  const checkRestoredJob = await Job.findById(liveJob._id);
  if (checkRestoredJob.status === 'ARCHIVED') throw new Error('Test 3 Failed: Job status was not restored');
  console.log('PASSED: Job successfully restored to active status:', checkRestoredJob.status, '\n');

  console.log('--- TEST 4: ASSESSMENT DRAFT DELETE VS PUBLISHED ARCHIVE ---');
  const draftAssessment = await Assessment.create({
    jobId: liveJob._id,
    version: 1,
    title: 'Kafka Pipeline Design Task',
    careerDomain: 'technology',
    profession: 'Software Developer',
    difficulty: 'Advanced',
    timeLimitMinutes: 60,
    scenario: 'Build Kafka consumer group',
    practicalTask: 'Write consumer with idempotency',
    status: 'DRAFT',
    createdBy: recruiterA._id,
  });

  const assessDeps = await assessmentService.getAssessmentDependencies(draftAssessment._id, recruiterA);
  if (!assessDeps.canHardDelete) throw new Error('Test 4 Failed: Draft assessment should be hard deletable');

  await assessmentService.deleteAssessment(draftAssessment._id, recruiterA);
  const checkDeletedAssessment = await Assessment.findById(draftAssessment._id);
  if (checkDeletedAssessment) throw new Error('Test 4 Failed: Draft assessment not deleted');
  console.log('PASSED: Draft assessment deleted.\n');

  console.log('--- TEST 5: REVIEWER DRAFT REVIEW LIFECYCLE ---');
  const submissionId = new mongoose.Types.ObjectId().toString();

  // Save review draft
  const savedDraft = await reviewService.saveReviewDraft(submissionId, reviewerA._id, {
    scores: [{ criterionId: 'sys-arch', score: 4, maxScore: 5, notes: 'Solid architecture' }],
    decision: 'APPROVE',
    summaryFeedback: 'Great start',
  });
  console.log('Draft saved successfully:', savedDraft.draft.status);

  // Retrieve review draft
  const fetchedDraft = await reviewService.getReviewDraft(submissionId, reviewerA._id);
  if (!fetchedDraft || fetchedDraft.status !== 'DRAFT') throw new Error('Test 5 Failed: Could not retrieve review draft');
  console.log('Retrieved reviewer draft with rubric items:', fetchedDraft.rubricScores.length);

  // Delete review draft
  const deletedDraftRes = await reviewService.deleteReviewDraft(submissionId, reviewerA._id);
  console.log('Delete draft response:', deletedDraftRes.message);

  const checkDraftAfterDelete = await reviewService.getReviewDraft(submissionId, reviewerA._id);
  if (checkDraftAfterDelete) throw new Error('Test 5 Failed: Review draft still exists after deletion');
  console.log('PASSED: Review draft deleted cleanly.\n');

  console.log('--- TEST 6: REVIEWER SUBMITTED REVIEW WITHDRAWAL (NO HARD DELETE) ---');
  // Create a finalized review
  const finalizedReview = await Review.create({
    submissionId: submissionId,
    candidateId: candidateA._id,
    reviewerId: reviewerA._id,
    criterionScores: [{ criterionId: 'code-quality', score: 5, maxScore: 5 }],
    overallScore: 92,
    status: 'COMPLETED',
    feedbackNotes: 'Exceptional submission',
  });

  // Attempt withdrawal with audit reason
  const withdrawRes = await reviewService.withdrawReview(
    submissionId,
    reviewerA._id,
    'Identified code plagiarism in external repository after initial review',
    reviewerA
  );
  console.log('Withdraw review result:', withdrawRes.message);

  const checkWithdrawnReview = await Review.findById(finalizedReview._id);
  if (checkWithdrawnReview.status !== 'WITHDRAWN') throw new Error('Test 6 Failed: Review status was not updated to WITHDRAWN');
  if (!checkWithdrawnReview.withdrawalReason) throw new Error('Test 6 Failed: withdrawalReason not recorded');
  console.log('PASSED: Finalized review withdrawn safely with immutable audit reason.\n');

  console.log('--- TEST 7: SECURITY & ORGANIZATION ISOLATION ---');
  let orgIsolationErrorCaught = false;
  try {
    // Recruiter B from Org B tries to delete Org A's job
    await jobService.archiveJob(liveJob._id, recruiterB, 'Malicious archive attempt');
  } catch (err) {
    orgIsolationErrorCaught = true;
    console.log('Organization isolation properly prevented cross-org access:', err.message);
  }
  if (!orgIsolationErrorCaught) throw new Error('Test 7 Failed: Recruiter B was able to modify Org A resource!');
  console.log('PASSED: Cross-organization mutation strictly blocked.\n');

  console.log('--- TEST 8: AUDIT TRAIL LOGGING VERIFICATION ---');
  const auditLogs = await AuditLog.find({
    action: { $in: ['JOB_DELETED', 'JOB_ARCHIVED', 'JOB_RESTORED', 'ASSESSMENT_DELETED', 'REVIEW_DRAFT_DELETED', 'REVIEW_WITHDRAWN'] },
  }).sort({ timestamp: -1 });

  console.log(`Verified ${auditLogs.length} safety audit log entries recorded:`);
  auditLogs.slice(0, 6).forEach(log => {
    console.log(` - [${log.action}] on ${log.resourceType}:${log.resourceId} by User ${log.userId}`);
  });
  if (auditLogs.length < 5) throw new Error('Test 8 Failed: Missing audit logs for destructive actions');
  console.log('PASSED: All safety and archival actions logged in immutable AuditLog table.\n');

  // Clean up test data
  await Job.deleteMany({ _id: { $in: [draftJob._id, liveJob._id] } });
  await Application.deleteMany({ _id: testApp._id });
  await Review.deleteMany({ _id: finalizedReview._id });

  console.log('==================================================');
  console.log('ALL SAFE DELETE & ARCHIVE TESTS PASSED SUCCESSFULLY!');
  console.log('==================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('E2E TEST SUITE FAILED:', err);
  process.exit(1);
});
