import { useState, useEffect, useCallback } from 'react';
import { passportService } from '../services/passport.service';
import type { ProofPassportData } from '../types/api';

export function useProofPassport(userId?: string) {
  const [passport, setPassport] = useState<ProofPassportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPassport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await passportService.getPassport(userId);
      if (res.success && res.data) {
        setPassport(res.data);
      } else {
        setPassport(null);
        setError(res.error || 'Failed to load proof passport.');
      }
    } catch (err: any) {
      setPassport(null);
      setError(err.message || 'Error loading passport credentials.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  return {
    passport,
    loading,
    error,
    refetch: fetchPassport,
  };
}
