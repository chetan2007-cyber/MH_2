const analyticsService = require('../services/analytics/analytics.service');

exports.getRecruiterAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getRecruiterAnalytics(req.user);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get recruiter analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
