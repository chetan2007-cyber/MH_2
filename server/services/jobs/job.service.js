const Job = require('../../models/Job');
const Organization = require('../../models/Organization');
const AuditLog = require('../../models/AuditLog');
const Application = require('../../models/Application');
const Assessment = require('../../models/Assessment');
const AssessmentAssignment = require('../../models/AssessmentAssignment');

class JobService {
  async createJob(data, user) {
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({
        name: 'Kaushal Autonomous Engineering Org',
        slug: 'kaushal-engineering',
        domain: 'technology',
        hiringDomains: ['technology', 'engineering_core', 'creative', 'finance'],
      });
    }

    const job = new Job({
      title: data.title,
      organizationId: data.organizationId || org._id,
      department: data.department || 'Engineering',
      careerDomain: data.careerDomain || 'technology',
      branch: data.branch || '',
      profession: data.profession || 'Software Developer',
      experience: data.experience || '2-5 years',
      employmentType: data.employmentType || 'Full-time',
      location: data.location || 'Bangalore, India (Hybrid)',
      description: data.description,
      requiredSkills: data.requiredSkills || [],
      optionalSkills: data.optionalSkills || [],
      difficulty: data.difficulty || 'Advanced',
      assessmentDurationMinutes: data.assessmentDurationMinutes || 60,
      status: 'DRAFT',
      createdBy: user?._id || org._id,
    });

    await job.save();

    await AuditLog.create({
      actorId: user?._id || org._id,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'JOB_CREATED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
      metadata: { title: job.title, department: job.department },
    });

    return job;
  }

  async listJobs(filters = {}) {
    const query = {};
    if (filters.careerDomain) query.careerDomain = filters.careerDomain;
    if (filters.profession) query.profession = filters.profession;
    if (filters.department) query.department = filters.department;
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { department: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return Job.find(query)
      .populate('organizationId', 'name slug logoUrl domain')
      .sort({ createdAt: -1 });
  }

  async getJobById(jobId) {
    const job = await Job.findById(jobId)
      .populate('organizationId', 'name slug logoUrl domain')
      .populate('publishedAssessmentId');
    if (!job) {
      throw new Error('Job requisition not found');
    }
    return job;
  }

  async generateJobDNA(jobId, user) {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const domain = job.careerDomain || 'technology';
    const profession = job.profession || 'Software Developer';

    // Domain-tailored intelligent Job DNA synthesis
    const technicalSkills = (job.requiredSkills && job.requiredSkills.length > 0
      ? job.requiredSkills
      : ['System Design', 'Architectural Modeling', 'Automated Testing', 'Error Resilience']
    ).map((s, idx) => ({
      name: s,
      importance: idx === 0 ? 'Mandatory' : idx === 1 ? 'High' : 'Medium',
    }));

    let defaultCompetencies = [];
    if (domain === 'engineering_core') {
      defaultCompetencies = [
        { name: 'Parametric CAD & Tolerancing', weight: 30, description: '3D modeling, GD&T, and manufacturing stack-up feasibility', proficiencyLevel: 'Advanced', verificationCriteria: ['Assembly model', 'Drawings'] },
        { name: 'FEA Stress & Thermal Simulation', weight: 25, description: 'Structural load analysis, factor of safety, and convergence', proficiencyLevel: 'Advanced', verificationCriteria: ['Convergence plot', 'Stress report'] },
        { name: 'Engineering Decision Records', weight: 20, description: 'Material selection trade-offs and structural justifications', proficiencyLevel: 'Proficient', verificationCriteria: ['Calculations', 'Trade-off memo'] },
        { name: 'Physical Validation & Testing', weight: 15, description: 'Test bench validation under dynamic operating conditions', proficiencyLevel: 'Proficient', verificationCriteria: ['Sensor log'] },
        { name: 'Technical Defense & Conviction', weight: 10, description: 'Ability to defend mathematical rigor and design choices', proficiencyLevel: 'Advanced', verificationCriteria: ['Live defense'] },
      ];
    } else if (domain === 'finance') {
      defaultCompetencies = [
        { name: 'Financial Modeling & DCF', weight: 30, description: 'Complex 3-statement forecast models and sensitivity', proficiencyLevel: 'Advanced', verificationCriteria: ['Excel formulas', 'Dynamic checks'] },
        { name: 'Ledger Audit & GAAP Compliance', weight: 25, description: 'Reconciliation audit trails and revenue recognition standards', proficiencyLevel: 'Advanced', verificationCriteria: ['Audit workpaper'] },
        { name: 'Risk & Variance Analysis', weight: 20, description: 'Variance decomposition and stress-test scenarios', proficiencyLevel: 'Proficient', verificationCriteria: ['Variance bridge'] },
        { name: 'Accounting Defense', weight: 25, description: 'Defending asset capitalization and tax treatment live', proficiencyLevel: 'Proficient', verificationCriteria: ['Defense memo'] },
      ];
    } else {
      defaultCompetencies = [
        { name: 'Distributed Architecture', weight: 30, description: 'Fault-tolerant boundary design and concurrency management', proficiencyLevel: 'Advanced', verificationCriteria: ['Git repository', 'Topology map'] },
        { name: 'System Resilience & Testing', weight: 25, description: 'Containerized unit, integration, and fuzz test suites', proficiencyLevel: 'Advanced', verificationCriteria: ['Hermetic test run'] },
        { name: 'Architectural Decision Records', weight: 20, description: 'Documented rationale for chosen trade-offs over alternatives', proficiencyLevel: 'Proficient', verificationCriteria: ['ADR logs'] },
        { name: 'Database / State Consistency', weight: 15, description: 'Transactional integrity, caching, and race condition prevention', proficiencyLevel: 'Proficient', verificationCriteria: ['ACID/CAS benchmark'] },
        { name: 'Live AST Defense', weight: 10, description: 'Defending code mechanics and design patterns under examination', proficiencyLevel: 'Advanced', verificationCriteria: ['Defense transcript'] },
      ];
    }

    job.jobDNA = {
      technicalSkills,
      problemSolvingFocus: [
        { dimension: 'Architectural Boundary Rigor', weight: 35 },
        { dimension: 'Constraint Optimization', weight: 35 },
        { dimension: 'Edge Case Resilience', weight: 30 },
      ],
      practicalRequirements: [
        `Deliver verifiable work meeting ${job.difficulty} benchmarks`,
        'Provide Architectural/Engineering Decision Records (ADR)',
        'Pass automated hermetic verification checks',
      ],
      mandatoryRequirements: [
        `${job.experience} proven domain experience`,
        'Demonstrated practical problem-solving in production scenarios',
        'Zero plagiarism or artificial credential fabrication',
      ],
      experienceYears: parseInt(job.experience) || 3,
      difficulty: job.difficulty,
      suggestedAssessmentTypes: ['Practical Task', 'Decision Record Defense', 'Automated Verification Suite'],
      generatedAt: new Date(),
    };

    job.competencies = defaultCompetencies;
    job.status = 'DNA_GENERATED';

    await job.save();

    await AuditLog.create({
      actorId: user?._id || job.createdBy || job._id,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'JOB_DNA_GENERATED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
      metadata: { jobTitle: job.title, competenciesCount: defaultCompetencies.length },
    });

    return job;
  }

  async updateCompetencies(jobId, competencies, user) {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const totalWeight = competencies.reduce((sum, c) => sum + Number(c.weight || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error(`Total competency weight must sum exactly to 100% (currently ${totalWeight}%)`);
    }

    job.competencies = competencies;
    await job.save();

    await AuditLog.create({
      actorId: user?._id || job._id,
      actorEmail: user?.email || 'recruiter@proofline.dev',
      actorRole: user?.role || 'RECRUITER',
      action: 'JOB_COMPETENCIES_UPDATED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
      metadata: { competenciesCount: competencies.length },
    });

    return job;
  }

  /**
   * Helper to verify recruiter/admin authorization and organization isolation
   */
  verifyJobAuthorization(job, user) {
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      throw err;
    }
    if (user.role === 'ADMIN') return true;

    if (user.role !== 'RECRUITER') {
      const err = new Error('Forbidden: Only recruiters or administrators can manage job requisitions.');
      err.status = 403;
      throw err;
    }

    // Organization & creator isolation
    const matchesOrg = user.organizationId && job.organizationId && user.organizationId.toString() === job.organizationId.toString();
    const matchesCreator = job.createdBy && job.createdBy.toString() === user._id.toString();

    if (!matchesOrg && !matchesCreator) {
      const err = new Error('Forbidden: You do not have permission to manage this job requisition across organizations.');
      err.status = 403;
      throw err;
    }
    return true;
  }

  /**
   * Calculates comprehensive dependency graph for a job before delete/archive
   */
  async getJobDependencies(jobId, user) {
    const job = await Job.findById(jobId).populate('organizationId', 'name slug');
    if (!job) {
      const err = new Error('Job requisition not found');
      err.status = 404;
      throw err;
    }

    this.verifyJobAuthorization(job, user);

    const [
      applicationCount,
      attemptsCount,
      assessmentCount,
      publishedAssessmentCount,
      shortlistedCount,
      interviewCount,
    ] = await Promise.all([
      Application.countDocuments({ jobId }),
      Application.countDocuments({
        jobId,
        $or: [
          { 'assessmentAttempt.submittedAt': { $exists: true, $ne: null } },
          { status: { $in: ['ASSESSMENT_SUBMITTED', 'UNDER_HUMAN_REVIEW', 'VERIFIED', 'SHORTLISTED', 'SELECTED'] } }
        ]
      }),
      Assessment.countDocuments({ jobId }),
      Assessment.countDocuments({ jobId, status: 'PUBLISHED' }),
      Application.countDocuments({ jobId, status: 'SHORTLISTED' }),
      Application.countDocuments({ jobId, status: { $in: ['INTERVIEW_SCHEDULED', 'SELECTED'] } }),
    ]);

    const isDraft = job.status === 'DRAFT' || job.status === 'DNA_GENERATED';
    const canHardDelete = isDraft && applicationCount === 0 && attemptsCount === 0 && publishedAssessmentCount === 0;
    const canArchive = job.status !== 'ARCHIVED';

    const blockingReasons = [];
    if (!isDraft) {
      blockingReasons.push(`Job requisition is currently ${job.status}, not in DRAFT state.`);
    }
    if (applicationCount > 0) {
      blockingReasons.push(`${applicationCount} candidate application(s) are attached to this job.`);
    }
    if (attemptsCount > 0) {
      blockingReasons.push(`${attemptsCount} candidate assessment deliverable(s) have been submitted.`);
    }
    if (publishedAssessmentCount > 0) {
      blockingReasons.push('A published assessment version is live in the candidate catalog.');
    }
    if (interviewCount > 0) {
      blockingReasons.push(`${interviewCount} interview or hiring decision(s) are recorded.`);
    }

    const recommendedAction = canHardDelete ? 'DELETE' : canArchive ? 'ARCHIVE' : 'NONE';

    return {
      jobId: job._id,
      title: job.title,
      status: job.status,
      careerDomain: job.careerDomain,
      department: job.department,
      canHardDelete,
      canArchive,
      recommendedAction,
      dependencies: {
        applicationCount,
        attemptsCount,
        assessmentCount,
        publishedAssessmentCount,
        shortlistedCount,
        interviewCount,
      },
      blockingReasons,
    };
  }

  /**
   * Permanently deletes a DRAFT job if and only if no candidate or workflow dependencies exist
   */
  async deleteJob(jobId, user) {
    const job = await Job.findById(jobId);
    if (!job) {
      const err = new Error('Job requisition not found');
      err.status = 404;
      throw err;
    }

    this.verifyJobAuthorization(job, user);

    const deps = await this.getJobDependencies(jobId, user);
    if (!deps.canHardDelete) {
      const err = new Error(
        `Cannot permanently delete job requisition: ${deps.blockingReasons.join(' ')} Please archive the job instead to preserve candidate history.`
      );
      err.status = 400;
      err.dependencies = deps.dependencies;
      err.blockingReasons = deps.blockingReasons;
      throw err;
    }

    // Safely remove unreferenced draft assessments
    await Assessment.deleteMany({ jobId, status: 'DRAFT' });

    // Permanently remove the draft job document
    await Job.findByIdAndDelete(jobId);

    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'JOB_DELETED',
      resourceType: 'Job',
      resourceId: jobId.toString(),
      metadata: {
        title: job.title,
        department: job.department,
        careerDomain: job.careerDomain,
        status: job.status,
      },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Draft job requisition "${job.title}" was permanently deleted.`,
      deletedId: jobId,
    };
  }

  /**
   * Archives a live or historical job. Stops new applications while preserving 100% of candidate history.
   */
  async archiveJob(jobId, user, reason) {
    const job = await Job.findById(jobId);
    if (!job) {
      const err = new Error('Job requisition not found');
      err.status = 404;
      throw err;
    }

    this.verifyJobAuthorization(job, user);

    if (job.status === 'ARCHIVED') {
      const err = new Error('Job requisition is already archived.');
      err.status = 400;
      throw err;
    }

    const previousStatus = job.status;
    job.status = 'ARCHIVED';
    job.archivedAt = new Date();
    job.archivedBy = user._id;
    job.archiveReason = reason || 'Archived by recruiter to close requisition while preserving candidate records.';
    await job.save();

    // Also transition any active draft assessments to ARCHIVED
    await Assessment.updateMany(
      { jobId, status: 'DRAFT' },
      { status: 'ARCHIVED', archivedAt: new Date(), archivedBy: user._id, archiveReason: 'Parent job archived' }
    );

    const appCount = await Application.countDocuments({ jobId });

    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'JOB_ARCHIVED',
      resourceType: 'Job',
      resourceId: jobId.toString(),
      metadata: {
        title: job.title,
        previousStatus,
        reason: job.archiveReason,
        preservedApplicationsCount: appCount,
      },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Job requisition "${job.title}" has been archived. Candidate applications and assessments remain intact.`,
      data: job,
    };
  }

  /**
   * Restores an archived job back to active status
   */
  async restoreJob(jobId, user) {
    const job = await Job.findById(jobId);
    if (!job) {
      const err = new Error('Job requisition not found');
      err.status = 404;
      throw err;
    }

    this.verifyJobAuthorization(job, user);

    if (job.status !== 'ARCHIVED') {
      const err = new Error('Job requisition is not archived.');
      err.status = 400;
      throw err;
    }

    job.status = job.publishedAssessmentId ? 'OPEN' : 'DNA_GENERATED';
    job.archivedAt = null;
    job.archivedBy = null;
    job.archiveReason = null;
    await job.save();

    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'JOB_RESTORED',
      resourceType: 'Job',
      resourceId: jobId.toString(),
      metadata: { title: job.title, newStatus: job.status },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Job requisition "${job.title}" has been restored to ${job.status}.`,
      data: job,
    };
  }
}

module.exports = new JobService();
