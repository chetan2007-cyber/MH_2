import React from 'react';
import { Layers, Award } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface CandidateHeaderProps {
  user: any;
  onNavigate: (view: string, extra?: any) => void;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({ user, onNavigate }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const candidateName = user?.name ? user.name.split(' ')[0] : 'Rahul';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '1.25rem',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Badge variant="cyan">ENGINEERING PROOF</Badge>
          <Badge variant="emerald">VERIFIED</Badge>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          {greeting}, {candidateName} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', marginBottom: 0 }}>
          Your engineering proof is growing.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <Button variant="secondary" size="sm" onClick={() => onNavigate('proofgraph')} leftIcon={<Layers size={14} color="var(--cyan-primary)" />}>
          Open ProofGraph™
        </Button>
        <Button variant="primary" size="sm" onClick={() => onNavigate('passport')} leftIcon={<Award size={14} />}>
          View Proof Passport™
        </Button>
      </div>
    </div>
  );
};
