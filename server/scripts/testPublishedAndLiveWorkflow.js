const mongoose = require('mongoose');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Job = require('../models/Job');
const Assessment = require('../models/Assessment');
const Application = require('../models/Application');
const jobService = require('../services/jobs/job.service');
const assessmentService = require('../services/assessments/assessment.service');
const applicationService = require('../services/applications/application.service');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proofline';

async function runTest() {
  console.log('====================================================');
  console.log('KAUSHAL — "PUBLISHED & LIVE" COMPLETE END-TO-END WORKFLOW TEST');
  console.log('====================================================\n');

  await mongoose.connect(MONGODB_URI);
  console.log(' Connected to MongoDB:', MONGODB_URI);

  let passed = 0;
  let total = 0;

  function assert(condition, name, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
    } else {
      console.error(`  ❌ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      throw new Error(`Assertion failed: ${name}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // STEP 1: RECRUITER SETUP & JOB CREATION
    // -------------------------------------------------------------
    console.log('\n--- 1. Recruiter Job & DNA Workflow ---');

    let recruiter = await User.findOne({ role: 'RECRUITER' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Kaushal Recruiter Lead',
        email: `recruiter_${Date.now()}@proofline.dev`,
        passwordHash: 'hashed_pw',
        role: 'RECRUITER',
      });
    }

    const org = await Organization.findOne();
    const newJob = await jobService.createJob({
      title: 'Senior Distributed Systems Architect',
      department: 'Platform Core',
      careerDomain: 'technology',
      profession: 'Software Developer',
      experience: '4-7 years',
      description: 'Architect zero-downtime distributed transactional engines under high concurrency.',
      requiredSkills: ['Distributed Consensus', 'Go / Rust', 'PostgreSQL', 'Redis CAS'],
      difficulty: 'Advanced',
      assessmentDurationMinutes: 60,
    }, recruiter);

    assert(Boolean(newJob._id), 'Job Requisition Created', `ID: ${newJob._id}`);
    assert(newJob.status === 'DRAFT', 'Job Status is DRAFT initially');

    // Generate Job DNA
    const jobWithDNA = await jobService.generateJobDNA(newJob._id, recruiter);
    assert(jobWithDNA.status === 'DNA_GENERATED', 'Job DNA Generated & Status DNA_GENERATED');
    assert(jobWithDNA.competencies.length >= 4, 'Job Competencies Initialized', `${jobWithDNA.competencies.length} competencies`);

    // -------------------------------------------------------------
    // STEP 2: RECRUITER GENERATE ASSESSMENT & PUBLISH
    // -------------------------------------------------------------
    console.log('\n--- 2. Recruiter Assessment Generation & Publishing ---');

    const draftAssessment = await assessmentService.generateAssessment(newJob._id, recruiter);
    assert(draftAssessment.status === 'DRAFT', 'Assessment generated in DRAFT state', `v${draftAssessment.version}`);
    assert(draftAssessment.version === 1, 'Assessment Version is 1');
    assert(draftAssessment.rubricCriteria.length > 0, 'Rubric criteria created');

    // Recruiter Publishes Assessment
    const publishedAssessment = await assessmentService.publishAssessment(draftAssessment._id, recruiter);
    assert(publishedAssessment.status === 'PUBLISHED', 'Assessment status is PUBLISHED');
    assert(Boolean(publishedAssessment.publishedAt), 'Assessment has publishedAt timestamp');

    // Verify Job is now OPEN with publishedAssessmentId linked
    const liveJob = await Job.findById(newJob._id);
    assert(liveJob.status === 'OPEN', 'Job Requisition Status is OPEN');
    assert(liveJob.publishedAssessmentId.toString() === publishedAssessment._id.toString(), 'Job publishedAssessmentId matches assessment ID');

    // -------------------------------------------------------------
    // STEP 3: CANDIDATE DISCOVERY & APPLICATION
    // -------------------------------------------------------------
    console.log('\n--- 3. Candidate Discovery & Application ---');

    let candidate = await User.create({
      name: `Candidate Test_${Date.now()}`,
      email: `candidate_${Date.now()}@proofline.dev`,
      passwordHash: 'hashed_pw',
      role: 'CANDIDATE',
      careerDomain: 'technology',
      profession: 'Software Developer',
    });

    const application = await applicationService.applyToJob(liveJob._id, candidate);
    assert(Boolean(application._id), 'Candidate applied to Job', `Application ID: ${application._id}`);
    assert(application.eligibility.isEligible === true, 'Candidate eligibility check passed');
    assert(application.status === 'ASSESSMENT_PENDING', 'Application status automatically becomes ASSESSMENT_PENDING');
    assert(application.assessmentAttempt.assessmentId.toString() === publishedAssessment._id.toString(), 'Published assessment assigned to candidate application');

    // -------------------------------------------------------------
    // STEP 4: CANDIDATE GETS ASSIGNED ASSESSMENT & STARTS ATTEMPT
    // -------------------------------------------------------------
    console.log('\n--- 4. Candidate Starts Assessment Attempt & Server Timer ---');

    const assessmentDetails = await applicationService.getAssessmentForApplication(application._id, candidate);
    assert(assessmentDetails.assessment.title === publishedAssessment.title, 'Assessment details retrieved successfully');
    assert(assessmentDetails.assessment.timeLimitMinutes === 60, 'Assessment time limit is 60 minutes');

    // Candidate clicks "Start Proof Assessment"
    const startResult = await applicationService.startAssessmentAttempt(application._id, candidate);
    assert(startResult.status === 'ASSESSMENT_IN_PROGRESS', 'Application status changed to ASSESSMENT_IN_PROGRESS');
    assert(Boolean(startResult.attempt.startedAt), 'Server-backed startedAt timestamp recorded');
    assert(Boolean(startResult.attempt.deadline), 'Server-calculated deadline timestamp recorded');
    assert(startResult.attempt.timeRemainingMs > 0 && startResult.attempt.timeRemainingMs <= 3600000, 'Server timer remaining milliseconds calculated correctly');

    // Verify idempotency: calling startAssessmentAttempt again preserves the original startedAt
    const resumeResult = await applicationService.startAssessmentAttempt(application._id, candidate);
    assert(new Date(resumeResult.attempt.startedAt).getTime() === new Date(startResult.attempt.startedAt).getTime(), 'Server timer is immutable across refreshes/tab reloads');

    // -------------------------------------------------------------
    // STEP 5: CANDIDATE SUBMITS SOLUTION & AI EVALUATION
    // -------------------------------------------------------------
    console.log('\n--- 5. Candidate Submission & Automated Evaluation ---');

    const submissionPayload = {
      assessmentId: publishedAssessment._id,
      workUrl: 'https://github.com/kaushal-verifiable/distributed-cas-coordinator',
      adrDecision: 'Architected atomic sliding-window state coordinator using Redis Lua scripts and lock-free CAS memory structures to prevent DB thread pool saturation.',
      notes: 'Implemented hermetic containerized test harness with 10,000 simulated concurrent transactions. Zero race conditions detected.',
      durationMinutes: 42,
    };

    const submittedApp = await applicationService.submitAssessmentAttempt(application._id, submissionPayload, candidate);
    assert(['ASSESSMENT_SUBMITTED', 'SHORTLISTED'].includes(submittedApp.status), 'Application status updated to submitted/shortlisted', submittedApp.status);
    assert(submittedApp.aiEvaluation.overallScore >= 85, 'AI Rubric evaluation completed with high score', `${submittedApp.aiEvaluation.overallScore}/100`);
    assert(submittedApp.whyShortlisted.isShortlisted === true, 'Candidate auto-shortlisted on high rubric performance');
    assert(submittedApp.roleFit.score >= 90, 'Role Fit Score calculated', `${submittedApp.roleFit.score}%`);

    // -------------------------------------------------------------
    // STEP 6: RECRUITER REAL-TIME STATS & PIPELINE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- 6. Recruiter Pipeline & Delivery Stats ---');

    const jobStats = await applicationService.getAssessmentStatsByJob(liveJob._id);
    assert(jobStats.assignedCount >= 1, 'Recruiter Assessment Stats: Assigned candidates counted', `${jobStats.assignedCount}`);
    assert(jobStats.completedCount >= 1, 'Recruiter Assessment Stats: Completed submissions counted', `${jobStats.completedCount}`);
    assert(jobStats.pendingCount === 0, 'Recruiter Assessment Stats: Pending count accurate', `${jobStats.pendingCount}`);

    const pipeline = await applicationService.getApplicationsByJob(liveJob._id);
    const candidateInPipeline = pipeline.find(p => p._id.toString() === application._id.toString());
    assert(Boolean(candidateInPipeline), 'Candidate visible in Recruiter Pipeline');
    assert(candidateInPipeline.whyShortlisted.isShortlisted === true, 'Shortlist flag present in Recruiter Pipeline');

    // Recruiter makes final selection decision
    const finalDecision = await applicationService.makeFinalDecision(application._id, {
      decision: 'SELECT',
      reason: 'Outstanding practical assessment submission with verified CAS architecture and 100% test pass rate.',
    }, recruiter);
    assert(finalDecision.status === 'SELECTED', 'Candidate finalized as SELECTED by Recruiter');

    // -------------------------------------------------------------
    // STEP 7: VERSION LOCK INTEGRITY TEST
    // -------------------------------------------------------------
    console.log('\n--- 7. Assessment Version Lock Integrity ---');

    // If recruiter generates v2, existing candidate's attempt must remain locked to v1
    const v2Assessment = await assessmentService.generateAssessment(liveJob._id, recruiter);
    assert(v2Assessment.version === 2, 'Assessment v2 created', `v${v2Assessment.version}`);

    const appRecord = await Application.findById(application._id);
    assert(appRecord.assessmentAttempt.assessmentId.toString() === publishedAssessment._id.toString(), 'Candidate application remained strictly locked to assigned v1');

    console.log('\n====================================================');
    console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: 0`);
    console.log('====================================================');
    console.log('🎉 "PUBLISHED & LIVE" COMPLETE ASSESSMENT WORKFLOW VERIFIED 100%!\n');

  } catch (err) {
    console.error('\n❌ Test execution failed with error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
