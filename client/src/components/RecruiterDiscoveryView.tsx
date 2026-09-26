import React from 'react';
import { RecruiterDiscover } from '../features/recruiter/components/RecruiterDiscover';
import type { RecruiterDiscoverProps } from '../features/recruiter/components/RecruiterDiscover';

export const RecruiterDiscoveryView: React.FC<RecruiterDiscoverProps> = (props) => {
  return <RecruiterDiscover {...props} />;
};
