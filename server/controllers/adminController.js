const adminService = require('../services/admin/admin.service');
const { logAudit } = require('../middleware/audit');

exports.getAdminOverview = async (req, res) => {
  try {
    const metrics = await adminService.getOverview();
    return res.json({ success: true, metrics });
  } catch (error) {
    console.error('Get admin overview error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving admin metrics.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving users.' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.userId);

    await logAudit({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: `USER_STATUS_${user.status}`,
      resourceType: 'User',
      resourceId: user._id.toString(),
      metadata: { targetUserEmail: user.email },
    });

    return res.json({
      success: true,
      message: `User status changed to ${user.status}.`,
      user,
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Server error updating user status.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await adminService.getAuditLogs();
    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    console.error('Admin get audit logs error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving audit logs.' });
  }
};
