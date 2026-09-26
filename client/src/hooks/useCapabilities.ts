import { useState, useEffect, useCallback } from 'react';
import { capabilityService } from '../services/capability.service';
import type { CandidateCapabilitiesResponse } from '../types/api';

export function useCapabilities(userId?: string) {
  const [capabilitiesData, setCapabilitiesData] = useState<CandidateCapabilitiesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapabilities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await capabilityService.getUserCapabilities(userId);
      if (res.success && res.data) {
        setCapabilitiesData(res.data);
      } else {
        setCapabilitiesData(null);
        setError(res.error || 'Failed to load capabilities.');
      }
    } catch (err: any) {
      setCapabilitiesData(null);
      setError(err.message || 'Error fetching capabilities.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCapabilities();
  }, [fetchCapabilities]);

  return {
    capabilitiesData,
    loading,
    error,
    refetch: fetchCapabilities,
  };
}
