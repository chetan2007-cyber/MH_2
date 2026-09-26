import React from 'react';
import { CandidateDashboard } from '../features/candidate/components/CandidateDashboard';
import type { CandidateDashboardProps } from '../features/candidate/components/CandidateDashboard';

export const EngineeringOverviewView: React.FC<CandidateDashboardProps> = (props) => {
  return <CandidateDashboard {...props} />;
};
