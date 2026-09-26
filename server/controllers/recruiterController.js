const recruiterService = require('../services/recruiter/recruiter.service');

exports.discoverCandidates = async (req, res) => {
  try {
    const candidates = await recruiterService.discoverCandidates(req.query);
    return res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    console.error('Discover candidates error:', error);
    return res.status(500).json({ success: false, error: 'Server error querying candidate vector mesh.' });
  }
};

exports.toggleSaveCandidate = async (req, res) => {
  try {
    const saved = await recruiterService.toggleSaveCandidate(req.user._id, req.params.candidateId);
    return res.json({
      success: true,
      message: saved ? 'Candidate bookmarked to talent pipeline.' : 'Candidate removed from saved talent.',
      saved,
    });
  } catch (error) {
    console.error('Toggle save candidate error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error updating saved candidate.' });
  }
};

// Aliases
exports.getCandidateEvidenceDossier = exports.discoverCandidates;

