import { useState, useEffect, useCallback } from 'react';
import { submissionService } from '../services/submission.service';
import type { Submission } from '../types/api';

export function useSubmissions(params?: { status?: string; domain?: string; role?: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submissionService.getSubmissions(params);
      if (res.success && res.data) {
        setSubmissions(Array.isArray(res.data) ? res.data : []);
      } else {
        setSubmissions([]);
        setError(res.error || 'Failed to fetch submissions.');
      }
    } catch (err: any) {
      setSubmissions([]);
      setError(err.message || 'An error occurred while loading submissions.');
    } finally {
      setLoading(false);
    }
  }, [params?.status, params?.domain, params?.role]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
  };
}

export function useSubmission(id?: string) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    if (!id) {
      setSubmission(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await submissionService.getSubmissionById(id);
      if (res.success && res.data) {
        setSubmission(res.data);
      } else {
        setSubmission(null);
        setError(res.error || 'Submission not found.');
      }
    } catch (err: any) {
      setSubmission(null);
      setError(err.message || 'Failed to load submission.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  return {
    submission,
    loading,
    error,
    refetch: fetchSubmission,
  };
}
