import { apiClient } from '../lib/api';
import type { Notification, ActivityItem, ApiResponse } from '../types/api';

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications');
  },

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  async getRecentActivity(): Promise<ApiResponse<ActivityItem[]>> {
    return apiClient.get<ActivityItem[]>('/users/me/activity');
  },
};
