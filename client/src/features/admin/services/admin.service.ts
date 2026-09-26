import { apiRequest } from '../../../lib/api';

export const adminService = {
  getAdminOverview: () =>
    apiRequest('/admin/overview'),

  getAdminUsers: () =>
    apiRequest('/admin/users'),

  toggleUserStatus: (id: string) =>
    apiRequest(`/admin/users/${id}/toggle-status`, { method: 'POST' }),

  getAuditLogs: () =>
    apiRequest('/admin/audit-logs'),
};
