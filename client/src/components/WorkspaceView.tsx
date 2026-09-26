import React from 'react';
import { WorkspaceStudio } from '../features/workspace/components/WorkspaceStudio';
import type { WorkspaceStudioProps } from '../features/workspace/components/WorkspaceStudio';

export const WorkspaceView: React.FC<WorkspaceStudioProps> = (props) => {
  return <WorkspaceStudio {...props} />;
};
