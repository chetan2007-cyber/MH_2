const Submission = require('../../models/Submission');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const AutomatedCheck = require('../../models/AutomatedCheck');
const DefenseRound = require('../../models/DefenseRound');

class SubmissionService {
  async getSubmissionWorkspace(submissionId) {
    const submission = await Submission.findById(submissionId).populate('challengeId');
    if (!submission) return null;

    const [project, adrs, automatedCheck, defenseRound] = await Promise.all([
      Project.findOne({ submissionId: submission._id }),
      ADR.find({ submissionId: submission._id }).sort({ decisionIndex: 1 }),
      AutomatedCheck.findOne({ submissionId: submission._id }),
      DefenseRound.findOne({ submissionId: submission._id }),
    ]);

    return { submission, project, adrs, automatedCheck, defenseRound };
  }

  async saveProjectArchitecture(submissionId, candidateId, data) {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found.');
    if (submission.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    let project = await Project.findOne({ submissionId });
    if (!project) {
      project = new Project({
        submissionId: submission._id,
        candidateId,
        challengeId: submission.challengeId,
      });
    }

    project.title = data.title || 'High-Concurrency Implementation';
    project.architectureSummary = data.architectureSummary || '';
    project.systemComponents = Array.isArray(data.systemComponents) ? data.systemComponents : [];
    project.dataFlowDescription = data.dataFlowDescription || '';
    project.techStack = Array.isArray(data.techStack) ? data.techStack : ['Node.js', 'PostgreSQL', 'Redis'];
    project.deployedUrl = data.deployedUrl || '';
    project.technicalExplanation = data.technicalExplanation || '';
    await project.save();

    submission.preflightChecks.architectureValid = !!(data.architectureSummary && data.dataFlowDescription);
    submission.preflightChecks.readmeValid = !!data.technicalExplanation;
    submission.preflightChecks.explanationValid = !!data.technicalExplanation;
    await submission.save();

    return { project, preflightChecks: submission.preflightChecks };
  }

  async createOrUpdateADR(submissionId, candidateId, adrData) {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found.');
    if (submission.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    let adr;
    if (adrData.adrId) {
      adr = await ADR.findById(adrData.adrId);
    }

    if (!adr) {
      adr = new ADR({
        submissionId: submission._id,
        candidateId,
        challengeId: submission.challengeId,
        decisionIndex: (await ADR.countDocuments({ submissionId: submission._id })) + 1,
      });
    }

    adr.title = adrData.title;
    adr.context = adrData.context;
    adr.decision = adrData.decision;
    adr.reasoning = adrData.reasoning || 'Standard decision evaluation';
    adr.status = adrData.status || 'ACCEPTED';
    adr.alternatives = Array.isArray(adrData.alternatives) ? adrData.alternatives : [];
    adr.consequences = {
      positive: adrData.consequences?.positive || [],
      negative: adrData.consequences?.negative || [],
    };
    adr.tradeOffs = adrData.tradeOffs || adrData.tradeoffs || 'Trade-offs documented and mitigated.';
    adr.evidenceCitation = adrData.evidenceCitation || 'src/main.ts';
    adr.version = (adr.version || 1) + 1;
    await adr.save();

    const adrCount = await ADR.countDocuments({ submissionId: submission._id });
    submission.preflightChecks.adrValid = adrCount > 0;
    await submission.save();

    return { adr, preflightChecks: submission.preflightChecks };
  }

  async deleteADR(submissionId, candidateId, adrId) {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found.');
    if (submission.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    await ADR.findOneAndDelete({ _id: adrId, submissionId });
    const adrCount = await ADR.countDocuments({ submissionId });
    submission.preflightChecks.adrValid = adrCount > 0;
    await submission.save();

    return submission.preflightChecks;
  }

  async validateAndFinalize(submissionId, candidateId) {
    const submission = await Submission.findById(submissionId).populate('challengeId');
    if (!submission) throw new Error('Submission not found.');
    if (submission.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    const missing = [];
    if (!submission.preflightChecks.architectureValid) missing.push('Architecture Overview & System Components');
    if (!submission.preflightChecks.adrValid) missing.push('At least one Architectural Decision Record (ADR)');
    if (!submission.preflightChecks.testsValid) missing.push('Automated Verification Test Pass');
    if (!submission.preflightChecks.explanationValid) missing.push('Technical Implementation Explanation');

    if (missing.length > 0) {
      const err = new Error('Preflight checks failed');
      err.missing = missing;
      err.status = 400;
      throw err;
    }

    submission.status = 'UNDER_REVIEW';
    submission.submittedAt = new Date();
    await submission.save();

    return submission;
  }

  async listSubmissions(filters = {}, user) {
    const query = {};
    if (user && user.role === 'CANDIDATE') {
      query.candidateId = user._id;
    }
    if (filters.status) query.status = filters.status;
    if (filters.challengeId) query.challengeId = filters.challengeId;

    const submissions = await Submission.find(query)
      .populate('challengeId')
      .populate('candidateId', 'name email role careerDomain profession headline avatar')
      .sort({ createdAt: -1 });

    return submissions;
  }
}

module.exports = new SubmissionService();

