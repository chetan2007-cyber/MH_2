import React from 'react';
import { ToastProvider } from '../components/Toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
