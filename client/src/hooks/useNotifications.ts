import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import type { Notification, ActivityItem } from '../types/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [notifRes, actRes] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getRecentActivity(),
      ]);
      if (notifRes.success && notifRes.data) {
        setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
      }
      if (actRes.success && actRes.data) {
        setActivities(Array.isArray(actRes.data) ? actRes.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading activity feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => (n._id === id || n.id === id ? { ...n, read: true } : n)));
  };

  return {
    notifications,
    activities,
    loading,
    error,
    refetch: fetchAll,
    markAsRead,
  };
}
