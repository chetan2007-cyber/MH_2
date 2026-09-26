import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
        if (res.error && res.status !== 401) {
          setError(res.error);
        }
      }
    } catch (err: any) {
      setUser(null);
      setError(err.message || 'Authentication check failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (data: { email: string; password?: string }) => {
    setLoading(true);
    setError(null);
    const res = await authService.login(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    } else {
      setError(res.error || 'Login failed.');
    }
    setLoading(false);
    return res;
  };

  const register = async (data: { name: string; email: string; password?: string; role: string; domain?: string; profession?: string }) => {
    setLoading(true);
    setError(null);
    const res = await authService.register(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    } else {
      setError(res.error || 'Registration failed.');
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await authService.updateProfile(updates);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refreshUser,
    login,
    register,
    logout,
    updateProfile,
  };
}
