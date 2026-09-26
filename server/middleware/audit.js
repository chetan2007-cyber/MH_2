const AuditLog = require('../models/AuditLog');

const logAudit = async ({
  actorId,
  actorEmail,
  actorRole,
  action,
  resourceType,
  resourceId,
  ipAddress,
  userAgent,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      actorId,
      actorEmail,
      actorRole: actorRole || 'SYSTEM',
      action,
      resourceType,
      resourceId,
      ipAddress: ipAddress || '127.0.0.1',
      userAgent,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Audit logging error:', error.message);
  }
};

module.exports = { logAudit };
