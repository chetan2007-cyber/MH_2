import { useState, useEffect, useCallback } from 'react';
import { opportunityService } from '../services/opportunity.service';
import type { Opportunity } from '../types/api';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await opportunityService.getOpportunities();
      if (res.success && res.data) {
        setOpportunities(Array.isArray(res.data) ? res.data : []);
      } else {
        setOpportunities([]);
        setError(res.error || 'Failed to load opportunities.');
      }
    } catch (err: any) {
      setOpportunities([]);
      setError(err.message || 'Error fetching opportunities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const sendOpportunity = async (payload: {
    candidateId: string;
    roleTitle: string;
    message: string;
    compensationRange?: string;
  }) => {
    return opportunityService.sendOpportunity(payload);
  };

  const updateStatus = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    const res = await opportunityService.updateOpportunityStatus(id, status);
    if (res.success) {
      fetchOpportunities();
    }
    return res;
  };

  return {
    opportunities,
    loading,
    error,
    refetch: fetchOpportunities,
    sendOpportunity,
    updateStatus,
  };
}
