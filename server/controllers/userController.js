const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const capabilityService = require('../services/capabilities/capability.service');
const proofGraphService = require('../services/proofgraph/proofgraph.service');
const passportService = require('../services/proofpassport/passport.service');

exports.getCurrentUser = async (req, res) => {
  try {
    let userId = req.user?._id;
    if (!userId) {
      const candidate = await CandidateProfile.findOne();
      userId = candidate ? candidate.userId : null;
    }
    if (!userId) {
      const user = await User.findOne();
      userId = user ? user._id : null;
    }
    if (!userId) return res.status(404).json({ success: false, error: 'User not found' });
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.careerDomain) updates.careerDomain = req.body.careerDomain;
    if (req.body.profession) updates.profession = req.body.profession;
    if (req.body.headline) updates.headline = req.body.headline;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.getUserCapabilities = async (req, res) => {
  try {
    let targetId = req.params.id;
    if (targetId === 'me') {
      if (req.user?._id) {
        targetId = req.user._id;
      } else {
        const candidate = await CandidateProfile.findOne();
        targetId = candidate ? candidate.userId : null;
      }
    }
    if (!targetId) {
      return res.json({ success: true, capabilities: [] });
    }
    const capabilities = await capabilityService.getCandidateCapabilities(targetId);
    res.json({ success: true, capabilities });
  } catch (error) {
    console.error('Get user capabilities error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProofGraph = async (req, res) => {
  try {
    let targetId = req.params.id;
    if (targetId === 'me') {
      if (req.user?._id) {
        targetId = req.user._id;
      } else {
        const candidate = await CandidateProfile.findOne();
        targetId = candidate ? candidate.userId : null;
      }
    }
    if (!targetId) {
      return res.json({ success: true, graph: { nodes: [], edges: [] } });
    }
    const graph = await proofGraphService.generateGraph(targetId);
    res.json({ success: true, graph });
  } catch (error) {
    console.error('Get user proof graph error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProofPassport = async (req, res) => {
  try {
    let targetId = req.params.id;
    if (targetId === 'me') {
      if (req.user?._id) {
        targetId = req.user._id;
      } else {
        const candidate = await CandidateProfile.findOne();
        targetId = candidate ? candidate.userId : null;
      }
    }
    if (!targetId) {
      return res.json({ success: true, passport: null });
    }
    const passport = await passportService.generatePassport(targetId);
    res.json({ success: true, passport });
  } catch (error) {
    console.error('Get user proof passport error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
