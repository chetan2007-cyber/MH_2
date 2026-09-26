import React from 'react';
import { AuthModal as ModularAuthModal } from '../features/auth/components/AuthModal';
import type { AuthModalProps } from '../features/auth/components/AuthModal';

export const AuthModal: React.FC<AuthModalProps> = (props) => {
  return <ModularAuthModal {...props} />;
};
