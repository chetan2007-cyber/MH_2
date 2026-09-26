const Submission = require('../../models/Submission');
const Project = require('../../models/Project');
const ADR = require('../../models/ADR');
const AutomatedCheck = require('../../models/AutomatedCheck');
const Review = require('../../models/Review');
const DefenseRound = require('../../models/DefenseRound');
const CapabilityScore = require('../../models/CapabilityScore');

class ProofGraphService {
  async generateGraph(candidateId) {
    const capabilities = await CapabilityScore.find({
      candidateId,
      status: 'VERIFIED',
    });

    const submissions = await Submission.find({
      candidateId,
      status: { $in: ['VERIFIED', 'UNDER_REVIEW', 'DEFENSE_PENDING', 'TESTING'] },
    }).populate('challengeId');

    const nodes = [];
    const edges = [];
    let edgeCounter = 1;

    // 1. Root Capabilities
    capabilities.forEach((cap, i) => {
      nodes.push({
        id: `cap-${cap.dimension}`,
        label: `${cap.displayName} (${cap.score})`,
        type: 'CAPABILITY_ROOT',
        score: cap.score,
        status: 'VERIFIED',
        confidence: cap.confidence,
        explanation: cap.explanation,
        x: 100 + i * 220,
        y: 60,
      });
    });

    // 2. Projects & Evidence
    for (let sIdx = 0; sIdx < submissions.length; sIdx++) {
      const sub = submissions[sIdx];
      const challenge = sub.challengeId;
      const [project, adrs, autoCheck, reviews, defense] = await Promise.all([
        Project.findOne({ submissionId: sub._id }),
        ADR.find({ submissionId: sub._id }),
        AutomatedCheck.findOne({ submissionId: sub._id }),
        Review.find({ submissionId: sub._id }),
        DefenseRound.findOne({ submissionId: sub._id }),
      ]);

      const baseY = 200 + sIdx * 300;

      const challengeNodeId = `chal-${sub._id}`;
      nodes.push({
        id: challengeNodeId,
        label: challenge ? challenge.title : 'Engineering Challenge',
        type: 'CHALLENGE',
        difficulty: challenge ? challenge.difficulty : 'PRODUCTION',
        domain: challenge ? challenge.domain : 'SYSTEMS',
        timeEstimate: challenge ? `${challenge.timeEstimateHours}h` : '4h',
        x: 180,
        y: baseY,
      });

      const projectNodeId = `proj-${sub._id}`;
      nodes.push({
        id: projectNodeId,
        label: project ? project.title : 'Verified Implementation',
        type: 'PROJECT',
        commitSha: sub.commitSha,
        techStack: project ? project.techStack : ['Node.js', 'PostgreSQL'],
        architectureSummary: project ? project.architectureSummary : '',
        explanation: project ? project.technicalExplanation : '',
        x: 400,
        y: baseY,
      });

      edges.push({
        id: `e-${edgeCounter++}`,
        source: challengeNodeId,
        target: projectNodeId,
        label: 'IMPLEMENTS',
      });

      capabilities.forEach((cap) => {
        if (cap.contributingSubmissionIds?.some((id) => id.toString() === sub._id.toString())) {
          edges.push({
            id: `e-${edgeCounter++}`,
            source: `cap-${cap.dimension}`,
            target: challengeNodeId,
            label: 'PROVES',
          });
        }
      });

      if (autoCheck) {
        const testNodeId = `test-${sub._id}`;
        nodes.push({
          id: testNodeId,
          label: `Tests (${autoCheck.passRate}%) · P99 ${autoCheck.p99LatencyMs}ms`,
          type: 'AUTOMATED_TESTS',
          p99LatencyMs: autoCheck.p99LatencyMs,
          throughputRps: autoCheck.throughputRps,
          executionLogs: autoCheck.executionLogs,
          x: 640,
          y: baseY - 60,
        });
        edges.push({
          id: `e-${edgeCounter++}`,
          source: projectNodeId,
          target: testNodeId,
          label: 'VERIFIES',
        });
      }

      adrs.forEach((adr, aIdx) => {
        const adrNodeId = `adr-${adr._id}`;
        nodes.push({
          id: adrNodeId,
          label: `ADR: ${adr.title}`,
          type: 'ADR',
          decision: adr.decision,
          evidenceCitation: adr.evidenceCitation,
          reasoning: adr.reasoning,
          x: 640,
          y: baseY + 40 + aIdx * 70,
        });
        edges.push({
          id: `e-${edgeCounter++}`,
          source: projectNodeId,
          target: adrNodeId,
          label: 'DECIDES',
        });
      });

      reviews.forEach((rev, rIdx) => {
        const revNodeId = `rev-${rev._id}`;
        nodes.push({
          id: revNodeId,
          label: `Peer Review (Score ${rev.overallScore}/10)`,
          type: 'EXPERT_REVIEW',
          overallScore: rev.overallScore,
          qualitativeSynthesis: rev.qualitativeSynthesis,
          x: 900,
          y: baseY - 30 + rIdx * 80,
        });
        edges.push({
          id: `e-${edgeCounter++}`,
          source: projectNodeId,
          target: revNodeId,
          label: 'AUDITED_BY',
        });
      });

      if (defense) {
        const defenseNodeId = `def-${sub._id}`;
        nodes.push({
          id: defenseNodeId,
          label: `Defense Round (${defense.status})`,
          type: 'DEFENSE_ROUND',
          status: defense.status,
          score: defense.score,
          questionsCount: defense.questions?.length || 3,
          x: 900,
          y: baseY + 80,
        });
        edges.push({
          id: `e-${edgeCounter++}`,
          source: projectNodeId,
          target: defenseNodeId,
          label: 'DEFENDED_BY',
        });
      }
    }

    return { nodes, edges };
  }
}

module.exports = new ProofGraphService();
