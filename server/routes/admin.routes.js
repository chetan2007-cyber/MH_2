const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(authenticate, requireRole('ADMIN'));

router.get('/overview', adminController.getAdminOverview);
router.get('/users', adminController.getUsers);
router.post('/users/:userId/toggle-status', adminController.toggleUserStatus);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
