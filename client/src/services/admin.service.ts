import { api } from '../lib/api';

export interface AuditLogItem {
  _id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: any;
  timestamp: string;
}

export const adminService = {
  async getOverview() {
    const res = await api.get('/admin/overview');
    return res.data?.metrics || {};
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data?.users || [];
  },

  async toggleUserStatus(userId: string) {
    const res = await api.patch(`/admin/users/${userId}/status`, {});
    return res.data;
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await api.get('/admin/audit-logs');
    return res.data?.logs || [];
  },
};
