import React from 'react';
import { Share2, Copy, Check, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface PassportShareCardProps {
  passport: any;
  copied: boolean;
  onCopy: () => void;
  onGenerate: () => void;
  onRevoke: () => void;
  actionMsg: string | null;
}

export const PassportShareCard: React.FC<PassportShareCardProps> = ({
  passport,
  copied,
  onCopy,
  onGenerate,
  onRevoke,
  actionMsg,
}) => {
  const isEnabled = passport?.publicProofEnabled && passport?.publicProofToken;
  const fullUrl = isEnabled ? `${window.location.origin}/proof/${passport.publicProofToken}` : '';

  return (
    <div className="forge-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Share2 size={16} color="var(--cyan-primary)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
            Public Proof Verification Link
          </h3>
        </div>

        {actionMsg && (
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-verified)', fontWeight: 600 }}>
            {actionMsg}
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
        Share your verifiable engineering profile with recruiters, hiring managers, or on your resume. Contact details and internal reviewer IDs are strictly scrubbed for privacy.
      </p>

      {isEnabled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 300px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-main)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {fullUrl}
          </div>

          <Button variant="secondary" size="sm" onClick={onCopy} leftIcon={copied ? <Check size={14} color="var(--emerald-verified)" /> : <Copy size={14} />}>
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button variant="secondary" size="sm" onClick={() => window.open(fullUrl, '_blank')} leftIcon={<ExternalLink size={14} />}>
            Preview Public View
          </Button>

          <Button variant="ghost" size="sm" onClick={onRevoke} leftIcon={<Trash2 size={14} color="var(--rose-error)" />}>
            Revoke Link
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="primary" size="sm" onClick={onGenerate} leftIcon={<RefreshCw size={14} />}>
            Generate Secure Public Link
          </Button>
        </div>
      )}
    </div>
  );
};
