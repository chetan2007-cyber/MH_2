import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/review.service';

export function useReviewQueue(domain?: string) {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.getReviewQueue(domain);
      const raw = (res as any).queue || (res as any).data || res;
      if (Array.isArray(raw)) {
        setQueue(raw);
      } else if (res.success && Array.isArray(res.data)) {
        setQueue(res.data);
      } else {
        setQueue([]);
        if (res.error) setError(res.error);
      }
    } catch (err: any) {
      setQueue([]);
      setError(err.message || 'An error occurred while loading reviewer queue.');
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return {
    queue,
    loading,
    error,
    refetch: fetchQueue,
  };
}
