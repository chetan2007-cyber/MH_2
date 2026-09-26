const crypto = require('crypto');
const Session = require('../../models/Session');

const parseDeviceInfo = (ua = '') => {
  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  let os = 'Windows';
  if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone')) os = 'iOS';

  return { browser, os, device: ua.includes('Mobile') ? 'Mobile' : 'Desktop' };
};

class SessionService {
  async createSession({ userId, ipAddress, userAgent }) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const deviceInfo = parseDeviceInfo(userAgent);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await Session.create({
      userId,
      tokenHash: sessionToken,
      ipAddress: ipAddress || '127.0.0.1',
      userAgent: userAgent || 'Unknown Client',
      deviceInfo,
      lastActiveAt: new Date(),
      expiresAt,
    });

    return session;
  }

  async getActiveSessions(userId, currentSessionToken) {
    const sessions = await Session.find({ userId }).sort({ lastActiveAt: -1 }).lean();
    return sessions.map((s) => ({
      id: s._id,
      browser: s.deviceInfo?.browser || 'Browser',
      os: s.deviceInfo?.os || 'OS',
      device: s.deviceInfo?.device || 'Desktop',
      ipAddress: s.ipAddress,
      lastActiveAt: s.lastActiveAt,
      isCurrent: s.tokenHash === currentSessionToken,
    }));
  }

  async revokeSession(userId, sessionId) {
    const session = await Session.findOneAndDelete({ _id: sessionId, userId });
    return session;
  }

  async revokeAllOtherSessions(userId, currentSessionToken) {
    const result = await Session.deleteMany({
      userId,
      tokenHash: { $ne: currentSessionToken },
    });
    return result;
  }

  async revokeByToken(token) {
    if (!token) return;
    await Session.deleteOne({ tokenHash: token });
  }
}

module.exports = new SessionService();
