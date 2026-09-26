import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/job.service';
import type { Job } from '../types/api';

export function useJobs(filters?: { careerDomain?: string; profession?: string; department?: string; status?: string; search?: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.listJobs(filters);
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job requisitions');
    } finally {
      setLoading(false);
    }
  }, [filters?.careerDomain, filters?.profession, filters?.department, filters?.status, filters?.search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}
