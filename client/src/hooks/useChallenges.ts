import { useState, useEffect, useCallback } from 'react';
import { challengeService } from '../services/challenge.service';
import type { Challenge, ChallengeFilter } from '../types/api';

export function useChallenges(filters?: ChallengeFilter) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await challengeService.getChallenges(filters);
      if (res.success && res.data) {
        setChallenges(Array.isArray(res.data) ? res.data : []);
      } else {
        setChallenges([]);
        setError(res.error || 'Failed to fetch challenges from server.');
      }
    } catch (err: any) {
      setChallenges([]);
      setError(err.message || 'An unexpected error occurred while loading challenges.');
    } finally {
      setLoading(false);
    }
  }, [filters?.domain, filters?.profession, filters?.difficulty, filters?.search]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return {
    challenges,
    loading,
    error,
    refetch: fetchChallenges,
  };
}

export function useChallenge(id?: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    if (!id) {
      setChallenge(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await challengeService.getChallengeById(id);
      if (res.success && res.data) {
        setChallenge(res.data);
      } else {
        setChallenge(null);
        setError(res.error || 'Challenge not found.');
      }
    } catch (err: any) {
      setChallenge(null);
      setError(err.message || 'Failed to load challenge details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  return {
    challenge,
    loading,
    error,
    refetch: fetchChallenge,
  };
}
