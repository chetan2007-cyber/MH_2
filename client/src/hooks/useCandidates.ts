import { useState, useEffect, useCallback } from 'react';
import { recruiterService } from '../services/recruiter.service';
import type { CandidateProfile, CandidateFilter } from '../types/api';

export function useCandidates(filters?: CandidateFilter) {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recruiterService.searchCandidates(filters);
      if (res.success && res.data) {
        setCandidates(Array.isArray(res.data) ? res.data : []);
      } else {
        setCandidates([]);
        setError(res.error || 'Failed to find candidates.');
      }
    } catch (err: any) {
      setCandidates([]);
      setError(err.message || 'Error searching candidate database.');
    } finally {
      setLoading(false);
    }
  }, [filters?.domain, filters?.profession, filters?.capability, filters?.search, filters?.minProofScore]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
  };
}

export function useCandidate(id?: string) {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidate = useCallback(async () => {
    if (!id) {
      setCandidate(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await recruiterService.getCandidateById(id);
      if (res.success && res.data) {
        setCandidate(res.data);
      } else {
        setCandidate(null);
        setError(res.error || 'Candidate dossier not found.');
      }
    } catch (err: any) {
      setCandidate(null);
      setError(err.message || 'Failed to load candidate dossier.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  return {
    candidate,
    loading,
    error,
    refetch: fetchCandidate,
  };
}
