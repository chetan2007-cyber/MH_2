import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Award, Code } from 'lucide-react';
import { Button, Input, Badge } from '../../../components/ui';

interface RegisterFormProps {
  role: 'CANDIDATE' | 'REVIEWER' | 'RECRUITER';
  setRole: (r: 'CANDIDATE' | 'REVIEWER' | 'RECRUITER') => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  skills: string;
  setSkills: (v: string) => void;
  organizationName: string;
  setOrganizationName: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  role,
  setRole,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  skills,
  setSkills,
  organizationName,
  setOrganizationName,
  loading,
  onSubmit,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Role Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Select Platform Role
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setRole('CANDIDATE')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${role === 'CANDIDATE' ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
              backgroundColor: role === 'CANDIDATE' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Code size={16} color={role === 'CANDIDATE' ? 'var(--cyan-primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: role === 'CANDIDATE' ? 'var(--text-main)' : 'var(--text-secondary)' }}>
              Candidate
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('REVIEWER')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${role === 'REVIEWER' ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
              backgroundColor: role === 'REVIEWER' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Award size={16} color={role === 'REVIEWER' ? 'var(--cyan-primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: role === 'REVIEWER' ? 'var(--text-main)' : 'var(--text-secondary)' }}>
              Expert Reviewer
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${role === 'RECRUITER' ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
              backgroundColor: role === 'RECRUITER' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Briefcase size={16} color={role === 'RECRUITER' ? 'var(--cyan-primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: role === 'RECRUITER' ? 'var(--text-main)' : 'var(--text-secondary)' }}>
              Recruiter
            </span>
          </button>
        </div>
      </div>

      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Arjun Kumar"
        leftIcon={<User size={16} />}
        required
      />

      <Input
        label="Work or Personal Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="arjun@engineering.dev"
        leftIcon={<Mail size={16} />}
        required
      />

      <div>
        <Input
          label="Password (Minimum 8 Characters)"
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

      {role === 'CANDIDATE' && (
        <Input
          label="Primary Technical Skills (Comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Go, Concurrency, Redis, PostgreSQL"
        />
      )}

      {role === 'RECRUITER' && (
        <Input
          label="Organization or Company Name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Stripe, Cloudflare, etc."
          required
        />
      )}

      <Button variant="primary" size="md" type="submit" isLoading={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
        Create Account & Begin Verification
      </Button>

      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{ background: 'transparent', border: 'none', color: 'var(--cyan-primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Sign in here
        </button>
      </div>
    </form>
  );
};
