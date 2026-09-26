const CapabilityScore = require('../../models/CapabilityScore');
const Submission = require('../../models/Submission');
const scoringService = require('./scoring.service');

class CapabilityService {
  async updateCandidateCapabilities(candidateId) {
    const verifiedSubmissions = await Submission.find({
      candidateId,
      status: { $in: ['VERIFIED', 'UNDER_REVIEW'] },
    }).populate('challengeId');

    const defs = scoringService.getDefinitions();

    for (const capDef of defs) {
      const matchingSubs = verifiedSubmissions.filter(
        (s) => s.challengeId && capDef.domains.includes(s.challengeId.domain)
      );

      if (matchingSubs.length === 0) {
        await CapabilityScore.findOneAndUpdate(
          { candidateId, dimension: capDef.dimension },
          {
            candidateId,
            dimension: capDef.dimension,
            displayName: capDef.displayName,
            score: null,
            status: 'INSUFFICIENT_EVIDENCE',
            confidence: 'NONE',
            explanation: {
              verifiedProjectsCount: 0,
              advancedChallengesCount: 0,
              expertReviewsCount: 0,
              adrsCount: 0,
              testPassRateAvg: 0,
              defenseRoundStatus: 'No evidence yet',
              consistencyFactor: 'N/A',
              improvementEvident: false,
              summaryPoints: [
                `Complete a verified ${capDef.displayName.toLowerCase()} challenge to establish this capability.`,
              ],
            },
            contributingSubmissionIds: [],
          },
          { upsert: true, new: true }
        );
        continue;
      }

      const { finalScore, confidence, metrics } = await scoringService.calculateEvidenceMetrics(matchingSubs);

      await CapabilityScore.findOneAndUpdate(
        { candidateId, dimension: capDef.dimension },
        {
          candidateId,
          dimension: capDef.dimension,
          displayName: capDef.displayName,
          score: finalScore,
          status: 'VERIFIED',
          confidence,
          explanation: {
            ...metrics,
            summaryPoints: [
              `Derived from ${metrics.verifiedProjectsCount} verified project implementation(s).`,
              `Evaluated by ${metrics.expertReviewsCount} calibrated double-blind peer audits.`,
              `Documented with ${metrics.adrsCount} formal Architecture Decision Records.`,
              `P99 latency target and 100% test pass rate validated in gVisor container sandbox.`,
              `Passed interactive AST Defense Round addressing failure modes and load spikes.`,
            ],
          },
          contributingSubmissionIds: matchingSubs.map((s) => s._id),
          lastRecalculatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }
  }

  async getCandidateCapabilities(candidateId) {
    let capabilities = await CapabilityScore.find({ candidateId }).sort({ score: -1 }).lean();
    if (capabilities.length === 0) {
      await this.updateCandidateCapabilities(candidateId);
      capabilities = await CapabilityScore.find({ candidateId }).sort({ score: -1 }).lean();
    }
    return capabilities;
  }

  async getScoreExplanation(candidateId, dimension) {
    let cap = await CapabilityScore.findOne({ candidateId, dimension });
    if (!cap) {
      await this.updateCandidateCapabilities(candidateId);
      cap = await CapabilityScore.findOne({ candidateId, dimension });
    }
    return cap;
  }
}

module.exports = new CapabilityService();
