import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../services/application.service';
import type { Application } from '../types/api';

export function useApplications(jobId?: string, filters?: { status?: string; isShortlisted?: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (jobId) {
        const data = await applicationService.getApplicationsByJob(jobId, filters);
        setApplications(data);
      } else {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [jobId, filters?.status, filters?.isShortlisted]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}
