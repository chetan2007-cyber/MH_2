import React from 'react';
import { ProofGraphView as ModularProofGraphView } from '../features/proofgraph/components/ProofGraphView';
import type { ProofGraphViewProps } from '../features/proofgraph/components/ProofGraphView';

export const ProofGraphView: React.FC<ProofGraphViewProps> = (props) => {
  return <ModularProofGraphView {...props} />;
};
