const proofGraphService = require('../services/proofgraph/proofgraph.service');

exports.getProofGraph = async (req, res) => {
  try {
    const candidateId = req.params.candidateId || req.user._id;
    const graph = await proofGraphService.generateGraph(candidateId);
    return res.json({ success: true, graph });
  } catch (error) {
    console.error('Get proof graph error:', error);
    return res.status(500).json({ success: false, error: 'Error generating live ProofGraph.' });
  }
};
