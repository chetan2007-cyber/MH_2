const Assessment = require('../../models/Assessment');
const Job = require('../../models/Job');
const Application = require('../../models/Application');
const AssessmentAssignment = require('../../models/AssessmentAssignment');
const AuditLog = require('../../models/AuditLog');

class AssessmentService {
  async generateAssessment(jobId, user) {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const allAssessments = await Assessment.find({ jobId: job._id }).sort({ version: -1 });
    const existingDraft = allAssessments.find(a => a.status === 'DRAFT');
    if (existingDraft) {
      return existingDraft;
    }

    const maxVersion = allAssessments.reduce((max, a) => Math.max(max, a.version || 0), 0);
    const nextVersion = maxVersion + 1;


    const domain = job.careerDomain || 'technology';
    const profession = job.profession || 'Software Developer';

    let scenario = '';
    let practicalTask = '';
    let constraints = [];
    let deliverables = [];
    let toolsAllowed = [];
    let expectedCompetencies = job.competencies.map(c => c.name);
    let rubricCriteria = [];

    if (domain === 'engineering_core') {
      scenario = `An industrial automation client requires a ${profession} subsystem capable of continuous duty in high-vibration conditions. The system must operate within a 2.4x Factor of Safety under dynamic shock loads while keeping mass under the strict payload threshold.`;
      practicalTask = `Design and compute the complete structural assembly, specify GD&T manufacturing tolerances, run finite element stress/convergence analysis, and document an Engineering Decision Record (EDR) defending material trade-offs.`;
      constraints = [
        'Factor of Safety > 2.2 under peak dynamic load',
        'ISO 286 standard tolerance fit specification',
        'Hermetic FEA mesh convergence within 1.0%',
      ];
      deliverables = [
        '3D CAD Parametric Assembly (STEP/IGES)',
        '2D Manufacturing Drawing with GD&T (PDF)',
        'FEA Stress & Thermal Convergence Report',
        'Engineering Decision Record (EDR)',
      ];
      toolsAllowed = ['SolidWorks', 'Fusion 360', 'Altium', 'ANSYS', 'MATLAB', 'Calculations Sheet'];
      rubricCriteria = [
        { id: 'math_rigor', label: 'Governing Equations & Physics Rigor', description: 'Correct application of mechanics and boundary conditions', maxScore: 5, weight: 25 },
        { id: 'dfma', label: 'DFMA & Manufacturing Feasibility', description: 'Machinability, tolerance stack-up, and tooling accessibility', maxScore: 5, weight: 25 },
        { id: 'simulation', label: 'Simulation Convergence & Mesh Integrity', description: 'Appropriate element selection and boundary load mapping', maxScore: 5, weight: 25 },
        { id: 'defense', label: 'Engineering Decision Defense', description: 'Defending material choice, fasteners, and safety factor live', maxScore: 5, weight: 25 },
      ];
    } else if (domain === 'finance') {
      scenario = `A mid-market enterprise is preparing for audit and debt restructuring. Reconcile complex deferred contract assets under ASC 340-20, detect discrepancy anomalies in the general ledger, and build a dynamic 3-statement DCF valuation bridge.`;
      practicalTask = `Audit the provided transaction records, document all adjusting journal entries, construct the DCF sensitivity matrix, and defend your revenue recognition memo.`;
      constraints = [
        'Full adherence to GAAP / IFRS standards',
        'Dynamic Excel formulas with zero hardcoded plugs',
        'Complete audit workpaper cross-referencing',
      ];
      deliverables = [
        'Audited General Ledger Model (.xlsx)',
        'Adjusting Journal Entries & Reconciliation Schedule',
        'ASC 340-20 Revenue Recognition Memo',
        'DCF Scenario & Sensitivity Matrix',
      ];
      toolsAllowed = ['Excel / Google Sheets', 'GAAP Audit Guidelines', 'Financial Modeling Toolkit'];
      rubricCriteria = [
        { id: 'gaap', label: 'GAAP / IFRS Technical Rigor', description: 'Correct categorization and standard compliance', maxScore: 5, weight: 30 },
        { id: 'formula_integrity', label: 'Spreadsheet Model Integrity', description: 'Dynamic formulas, circularity checks, and cleanliness', maxScore: 5, weight: 25 },
        { id: 'variance_depth', label: 'Anomaly & Variance Detection', description: 'Identifying hidden balance sheet discrepancies', maxScore: 5, weight: 25 },
        { id: 'audit_defense', label: 'Audit Reasoning Defense', description: 'Defending accounting treatments under cross-examination', maxScore: 5, weight: 20 },
      ];
    } else {
      scenario = `A high-throughput distributed transaction platform is experiencing race conditions and tail-latency spikes during peak concurrency. You are tasked with re-architecting the critical concurrency bottleneck.`;
      practicalTask = `Implement a fault-tolerant atomic lock-free or CAS state coordinator in production code, accompany it with comprehensive hermetic containerized test suites, and write an Architectural Decision Record (ADR) justifying data consistency trade-offs.`;
      constraints = [
        'Sub-10ms p99 latency under 10,000 concurrent ops',
        'Hermetic test suite with zero flakiness',
        'Zero data race conditions (verified via race detector)',
      ];
      deliverables = [
        'Production Code Repository (Clean Git history)',
        'Architectural Decision Record (ADR-001)',
        'Automated Fuzzing & Concurrency Test Suite',
        'Live AST / Architecture Defense Video',
      ];
      toolsAllowed = ['Git', 'Docker', 'Language Toolchains (Go/Rust/Node/Java/Python)', 'Postman/cURL'];
      rubricCriteria = [
        { id: 'architecture', label: 'Boundary & Concurrency Architecture', description: 'Clean separation of concerns, deadlock prevention, and scaling', maxScore: 5, weight: 30 },
        { id: 'testing', label: 'Hermetic Testing & Edge Case Depth', description: 'Fuzz testing, race detection, and boundary validation', maxScore: 5, weight: 25 },
        { id: 'adr_rigor', label: 'ADR Quality & Trade-off Articulation', description: 'Thorough justification of chosen approach over alternatives', maxScore: 5, weight: 25 },
        { id: 'code_craft', label: 'Idiomatic Implementation & Cleanliness', description: 'Production-ready error handling, logging, and readability', maxScore: 5, weight: 20 },
      ];
    }

    const assessment = new Assessment({
      jobId: job._id,
      version: nextVersion,
      title: `${job.title} — Proof Assessment (v${nextVersion})`,
      careerDomain: domain,
      profession,
      difficulty: job.difficulty || 'Advanced',
      timeLimitMinutes: job.assessmentDurationMinutes || 60,
      scenario,
      practicalTask,
      constraints,
      deliverables,
      toolsAllowed,
      expectedCompetencies,
      rubricCriteria,
      status: 'DRAFT',
      createdBy: user?._id || job.createdBy || job._id,
      changeNotes: `Generated AI Assessment v${nextVersion} aligned with Job DNA.`,
    });

    await assessment.save();

    await AuditLog.create({
      actorId: user?._id || job.createdBy || job._id,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'ASSESSMENT_GENERATED',
      resourceType: 'Assessment',
      resourceId: assessment._id.toString(),
      metadata: { jobId: job._id.toString(), version: nextVersion },
    });

    return assessment;
  }

  async getAssessmentsByJob(jobId) {
    return Assessment.find({ jobId }).sort({ version: -1 });
  }

  async getAssessmentById(id) {
    const assessment = await Assessment.findById(id).populate('jobId');
    if (!assessment) throw new Error('Assessment not found');
    return assessment;
  }

  async updateAssessment(id, data, user) {
    const assessment = await Assessment.findById(id);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.status === 'PUBLISHED') {
      throw new Error('Published assessments are immutable to preserve candidate integrity. Generate a new version instead.');
    }

    if (data.title) assessment.title = data.title;
    if (data.scenario) assessment.scenario = data.scenario;
    if (data.practicalTask) assessment.practicalTask = data.practicalTask;
    if (data.constraints) assessment.constraints = data.constraints;
    if (data.deliverables) assessment.deliverables = data.deliverables;
    if (data.toolsAllowed) assessment.toolsAllowed = data.toolsAllowed;
    if (data.rubricCriteria) assessment.rubricCriteria = data.rubricCriteria;
    if (data.timeLimitMinutes) assessment.timeLimitMinutes = data.timeLimitMinutes;
    if (data.changeNotes) assessment.changeNotes = data.changeNotes;

    await assessment.save();

    await AuditLog.create({
      actorId: user?._id || assessment.createdBy,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'ASSESSMENT_UPDATED',
      resourceType: 'Assessment',
      resourceId: assessment._id.toString(),
    });

    return assessment;
  }

  async publishAssessment(id, user) {
    const assessment = await Assessment.findById(id);
    if (!assessment) throw new Error('Assessment not found');

    assessment.status = 'PUBLISHED';
    assessment.publishedAt = new Date();
    await assessment.save();

    // Link into Job Requisition and mark job OPEN
    const job = await Job.findByIdAndUpdate(assessment.jobId, {
      publishedAssessmentId: assessment._id,
      status: 'OPEN',
    }, { new: true });

    // Automatically create AssessmentAssignment records for any eligible applicants
    const Application = require('../../models/Application');
    const AssessmentAssignment = require('../../models/AssessmentAssignment');
    const Notification = require('../../models/Notification');

    const pendingApps = await Application.find({
      jobId: assessment.jobId,
      status: { $in: ['APPLIED', 'ELIGIBLE', 'ASSESSMENT_PENDING'] },
    });

    for (const app of pendingApps) {
      app.status = 'ASSESSMENT_PENDING';
      app.assessmentAttempt = {
        assessmentId: assessment._id,
      };
      await app.save();

      await AssessmentAssignment.findOneAndUpdate(
        { candidateId: app.candidateId, jobId: assessment.jobId },
        {
          assessmentId: assessment._id,
          assessmentVersion: assessment.version,
          jobId: assessment.jobId,
          applicationId: app._id,
          candidateId: app.candidateId,
          assignedAt: new Date(),
          status: 'ASSIGNED',
        },
        { upsert: true, new: true }
      );

      await Notification.create({
        userId: app.candidateId,
        title: `Assessment Live: ${assessment.title}`,
        message: `Your practical assessment is now available in your workspace.`,
        type: 'ASSESSMENT',
        link: `/workspace`,
      });
    }

    // Sync to Platform Challenges pool so candidates can discover and solve it
    const Challenge = require('../../models/Challenge');
    const existingChallenge = await Challenge.findOne({ slug: `job-assessment-${assessment._id}` });
    if (!existingChallenge) {
      let challengeDomain = 'DISTRIBUTED_SYSTEMS';
      if (assessment.careerDomain === 'engineering_core') challengeDomain = 'SYSTEM_DESIGN';
      else if (assessment.careerDomain === 'finance') challengeDomain = 'DATABASE_ENGINEERING';
      else if (assessment.careerDomain === 'creative') challengeDomain = 'FULL_STACK';

      let challengeDifficulty = 'ADVANCED';
      if (assessment.difficulty?.toUpperCase() === 'FOUNDATION') challengeDifficulty = 'FOUNDATION';
      else if (assessment.difficulty?.toUpperCase() === 'PRODUCTION') challengeDifficulty = 'PRODUCTION';
      else if (assessment.difficulty?.toUpperCase() === 'STAFF') challengeDifficulty = 'STAFF';

      await Challenge.create({
        title: assessment.title,
        slug: `job-assessment-${assessment._id}`,
        domain: challengeDomain,
        difficulty: challengeDifficulty,
        difficultyWeight: 1.4,
        timeEstimateHours: Math.max(1, Math.round((assessment.timeLimitMinutes || 60) / 60)),
        summary: assessment.practicalTask || assessment.scenario || 'Practical enterprise proof assessment.',
        businessContext: assessment.scenario || job?.description || 'Enterprise candidate assessment.',
        requirements: assessment.constraints || ['Deliver verifiable engineering artifacts', 'Provide Architectural Decision Record (ADR)'],
        constraints: {
          zeroDataLoss: true,
          memoryCeilingMb: 512,
        },
        skills: job?.requiredSkills || ['3D CAD Software', 'Engineering Principles', 'GD&T'],
        evaluationCriteria: (assessment.rubricCriteria || []).map(r => r.label || r.criterionId || 'Domain Verification'),
        hiddenTestsCount: 15,
        totalSubmissionsCount: 0,
      });
    }

    await AuditLog.create({
      actorId: user?._id || assessment.createdBy,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'ASSESSMENT_PUBLISHED',
      resourceType: 'Assessment',
      resourceId: assessment._id.toString(),
      metadata: { jobId: assessment.jobId.toString(), version: assessment.version },
    });

    return assessment;
  }

  /**
   * Helper to verify recruiter/admin authorization for assessment management
   */
  async verifyAssessmentAuthorization(assessment, user) {
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      throw err;
    }
    if (user.role === 'ADMIN') return true;

    if (user.role !== 'RECRUITER') {
      const err = new Error('Forbidden: Only recruiters or administrators can manage assessments.');
      err.status = 403;
      throw err;
    }

    const job = await Job.findById(assessment.jobId);
    const matchesOrg = user.organizationId && job?.organizationId && user.organizationId.toString() === job.organizationId.toString();
    const matchesCreator = assessment.createdBy && assessment.createdBy.toString() === user._id.toString();

    if (!matchesOrg && !matchesCreator) {
      const err = new Error('Forbidden: You do not have permission to manage this assessment across organizations.');
      err.status = 403;
      throw err;
    }
    return true;
  }

  /**
   * Calculates dependencies for an assessment version before delete/archive
   */
  async getAssessmentDependencies(assessmentId, user) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      const err = new Error('Assessment not found');
      err.status = 404;
      throw err;
    }

    await this.verifyAssessmentAuthorization(assessment, user);

    const job = await Job.findById(assessment.jobId);

    const [attemptsCount, assignmentsCount] = await Promise.all([
      Application.countDocuments({
        $or: [
          { 'assessmentAttempt.assessmentId': assessment._id },
          { jobId: assessment.jobId, 'assessmentAttempt.submittedAt': { $exists: true, $ne: null } }
        ]
      }),
      AssessmentAssignment.countDocuments({ assessmentId: assessment._id }),
    ]);

    const isJobPublishedVersion = job && job.publishedAssessmentId && job.publishedAssessmentId.toString() === assessment._id.toString();
    const canHardDelete = assessment.status === 'DRAFT' && attemptsCount === 0 && !isJobPublishedVersion;
    const canArchive = assessment.status !== 'ARCHIVED';

    const blockingReasons = [];
    if (assessment.status !== 'DRAFT') {
      blockingReasons.push(`Assessment version ${assessment.version} is currently ${assessment.status}, not DRAFT.`);
    }
    if (attemptsCount > 0) {
      blockingReasons.push(`${attemptsCount} candidate assessment deliverable(s) or attempt(s) are attached to this version.`);
    }
    if (isJobPublishedVersion) {
      blockingReasons.push('This version is currently set as the active published assessment for the job requisition.');
    }

    const recommendedAction = canHardDelete ? 'DELETE' : canArchive ? 'ARCHIVE' : 'NONE';

    return {
      assessmentId: assessment._id,
      title: assessment.title,
      version: assessment.version,
      status: assessment.status,
      jobId: assessment.jobId,
      canHardDelete,
      canArchive,
      recommendedAction,
      dependencies: {
        attemptsCount,
        assignmentsCount,
        isJobPublishedVersion: !!isJobPublishedVersion,
      },
      blockingReasons,
    };
  }

  /**
   * Deletes a draft assessment version if no candidate attempts exist
   */
  async deleteAssessment(assessmentId, user) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      const err = new Error('Assessment not found');
      err.status = 404;
      throw err;
    }

    await this.verifyAssessmentAuthorization(assessment, user);

    const deps = await this.getAssessmentDependencies(assessmentId, user);
    if (!deps.canHardDelete) {
      const err = new Error(
        `Cannot permanently delete assessment version: ${deps.blockingReasons.join(' ')} Please archive or retire this version instead.`
      );
      err.status = 400;
      err.dependencies = deps.dependencies;
      err.blockingReasons = deps.blockingReasons;
      throw err;
    }

    await Assessment.findByIdAndDelete(assessmentId);

    // If job was pointing to this draft, clear it
    await Job.findOneAndUpdate(
      { _id: assessment.jobId, publishedAssessmentId: assessment._id },
      { $unset: { publishedAssessmentId: 1 } }
    );

    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'ASSESSMENT_DELETED',
      resourceType: 'Assessment',
      resourceId: assessmentId.toString(),
      metadata: {
        title: assessment.title,
        version: assessment.version,
        jobId: assessment.jobId.toString(),
      },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Draft assessment version ${assessment.version} was permanently deleted.`,
      deletedId: assessmentId,
    };
  }

  /**
   * Archives an assessment version while preserving historical records
   */
  async archiveAssessment(assessmentId, user, reason) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      const err = new Error('Assessment not found');
      err.status = 404;
      throw err;
    }

    await this.verifyAssessmentAuthorization(assessment, user);

    if (assessment.status === 'ARCHIVED') {
      const err = new Error('Assessment version is already archived.');
      err.status = 400;
      throw err;
    }

    const previousStatus = assessment.status;
    assessment.status = 'ARCHIVED';
    assessment.archivedAt = new Date();
    assessment.archivedBy = user._id;
    assessment.archiveReason = reason || 'Archived by recruiter';
    await assessment.save();

    // If this was the active published version for the job, find alternative published version or unset
    const job = await Job.findById(assessment.jobId);
    if (job && job.publishedAssessmentId && job.publishedAssessmentId.toString() === assessment._id.toString()) {
      const alternative = await Assessment.findOne({ jobId: job._id, status: 'PUBLISHED', _id: { $ne: assessment._id } }).sort({ version: -1 });
      job.publishedAssessmentId = alternative ? alternative._id : null;
      if (!alternative) job.status = 'DNA_GENERATED';
      await job.save();
    }

    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'ASSESSMENT_ARCHIVED',
      resourceType: 'Assessment',
      resourceId: assessmentId.toString(),
      metadata: {
        title: assessment.title,
        version: assessment.version,
        previousStatus,
        reason: assessment.archiveReason,
        jobId: assessment.jobId.toString(),
      },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Assessment version ${assessment.version} archived successfully. Candidate attempt history preserved.`,
      data: assessment,
    };
  }
}

module.exports = new AssessmentService();
