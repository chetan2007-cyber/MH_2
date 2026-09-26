import React from 'react';
import { PassportView as ModularPassportView } from '../features/proofpassport/components/PassportView';
import type { PassportViewProps } from '../features/proofpassport/components/PassportView';

export const PassportView: React.FC<PassportViewProps> = (props) => {
  return <ModularPassportView {...props} />;
};
