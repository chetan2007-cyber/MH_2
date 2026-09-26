import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import { CandidateHeader } from './CandidateHeader';
import { ProofStrengthCard } from './ProofStrengthCard';
import { ContinueChallengeCard } from './ContinueChallengeCard';
import { CapabilityMap } from './CapabilityMap';
import { WhyScoreModal } from './WhyScoreModal';
import { EngineeringActivity } from './EngineeringActivity';

export interface CandidateDashboardProps {
  user: any;
  onNavigate: (view: string, extra?: any) => void;
  onStartChallenge: (submissionId: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  user,
  onNavigate,
  onStartChallenge,
}) => {
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [passport, setPassport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCapForWhy, setSelectedCapForWhy] = useState<any | null>(null);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [capRes, passRes] = await Promise.all([
        api.getCapabilities(),
        api.getMyPassport(),
      ]);

      if (capRes.success && capRes.capabilities) {
        setCapabilities(capRes.capabilities);
      }
      if (passRes.success && passRes.passport) {
        setPassport(passRes.passport);
      }
    } catch (err) {
      console.error('Error loading overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  const topScore = capabilities.reduce(
    (max, c) => (c.score && c.score > max ? c.score : max),
    92
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Header & Philosophy */}
      <CandidateHeader user={user} onNavigate={onNavigate} />

      {/* 2. Key Engineering Signals Strip */}
      <ProofStrengthCard topScore={topScore} passport={passport} />

      {/* 3. Continue Active Project Card */}
      <ContinueChallengeCard onStartChallenge={onStartChallenge} />

      {/* 4. Multidimensional Capability Map */}
      <CapabilityMap
        capabilities={capabilities}
        loading={loading}
        onNavigate={onNavigate}
        onSelectWhy={setSelectedCapForWhy}
      />

      {/* 5. Chronological Provenance Timeline */}
      <EngineeringActivity />

      {/* 6. Why Score Breakdown Modal */}
      <WhyScoreModal
        capability={selectedCapForWhy}
        onClose={() => setSelectedCapForWhy(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
