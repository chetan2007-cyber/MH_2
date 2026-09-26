import { useState, useEffect, useCallback } from 'react';
import { proofGraphService } from '../services/proofgraph.service';
import type { ProofGraphData } from '../types/api';

export function useProofGraph(userId?: string) {
  const [graphData, setGraphData] = useState<ProofGraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await proofGraphService.getProofGraph(userId);
      if (res.success && res.data) {
        setGraphData(res.data);
      } else {
        setGraphData(null);
        setError(res.error || 'Failed to load proof graph.');
      }
    } catch (err: any) {
      setGraphData(null);
      setError(err.message || 'Error loading proof graph.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return {
    graphData,
    loading,
    error,
    refetch: fetchGraph,
  };
}
