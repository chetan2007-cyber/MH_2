import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, GitBranch } from 'lucide-react';
import { Button, Input } from '../../../components/ui';

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onForgotPassword,
  onSwitchToRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('ProofWork2026!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Section 26 Title & Subtitle */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          Your work should speak for you.
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', margin: 0 }}>
          Sign in to continue building your engineering proof.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="rahul.sharma@example.com"
          leftIcon={<Mail size={16} />}
          required
        />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.75rem',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </button>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.65rem', fontSize: '0.9375rem', fontWeight: 700 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Continue with GitHub (Section 26) */}
        <button
          type="button"
          onClick={() => fillDemo('arjun.candidate@proofline.dev')}
          className="btn btn-secondary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <GitBranch size={16} />
          <span>Continue with GitHub</span>
        </button>

        {/* Don't have an account? Create one */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Create one
          </button>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Demo Quick-Fill Accounts:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={() => fillDemo('arjun.candidate@proofline.dev')}
              className="kaushal-badge kaushal-badge-cyan"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Candidate (Rahul)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('vikram.reviewer@proofline.dev')}
              className="kaushal-badge kaushal-badge-purple"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Reviewer (Vikram)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sarah.recruiter@stripe.internal')}
              className="kaushal-badge kaushal-badge-emerald"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Recruiter (Sarah)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
