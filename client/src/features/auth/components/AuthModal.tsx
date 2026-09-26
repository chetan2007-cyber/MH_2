import React, { useState } from 'react';
import { BrandLogo } from '../../../components/layout/BrandLogo';
import { api, setMemoryToken } from '../../../api';
import { useToast } from '../../../components/Toast';
import { Modal } from '../../../components/ui';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>(initialTab);
  const [role, setRole] = useState<'CANDIDATE' | 'REVIEWER' | 'RECRUITER'>('CANDIDATE');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [skills, setSkills] = useState('Go, PostgreSQL, Redis');

  // Verification & Reset
  const [verifyToken, setVerifyToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setMemoryToken(res.token);
        showToast('success', 'Authentication Successful', `Welcome back, ${res.user.name}.`);
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let res;
      if (role === 'CANDIDATE') {
        res = await api.registerCandidate({
          name,
          email,
          password,
          skills: skills.split(',').map((s) => s.trim()),
          targetRoles: ['Backend Engineer'],
        });
      } else if (role === 'REVIEWER') {
        res = await api.registerReviewer({
          name,
          email,
          password,
          expertiseDomains: ['Distributed Systems', 'Backend'],
          yearsExperience: 7,
        });
      } else {
        res = await api.registerRecruiter({
          name,
          email,
          password,
          organizationName,
          roleTitle: 'Technical Recruiter',
        });
      }

      if (res.success) {
        setSuccessMsg(res.message || 'Registration successful! Verification token generated.');
        if (res.verificationToken) {
          setVerifyToken(res.verificationToken);
        }
        setTab('verify');
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyEmail(verifyToken);
      if (res.success) {
        showToast('success', 'Email Verified', 'You can now sign in to your verified account.');
        setTab('login');
      } else {
        setError(res.error || 'Invalid or expired verification token.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BrandLogo size={24} showWordmark={true} />
        </div>
      }
      description={
        tab === 'login'
          ? "Don't claim your skills. Prove them."
          : tab === 'register'
          ? 'Create your verified proof-of-work engineering identity.'
          : 'Complete security verification.'
      }
    >
      {error && (
        <div
          style={{
            padding: '0.625rem 0.875rem',
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            color: 'var(--rose-error)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '0.625rem 0.875rem',
            backgroundColor: 'rgba(5, 150, 105, 0.08)',
            color: 'var(--emerald-verified)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}
        >
          {successMsg}
        </div>
      )}

      {tab === 'login' && (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleLogin}
          onForgotPassword={() => setTab('forgot')}
          onSwitchToRegister={() => setTab('register')}
        />
      )}

      {tab === 'register' && (
        <RegisterForm
          role={role}
          setRole={setRole}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          skills={skills}
          setSkills={setSkills}
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          loading={loading}
          onSubmit={handleRegister}
          onSwitchToLogin={() => setTab('login')}
        />
      )}

      {tab === 'verify' && (
        <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Verification Token
            </label>
            <input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="Paste verification token..."
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-main)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginTop: '4px',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Verify Email & Activate Account'}
          </button>
        </form>
      )}
    </Modal>
  );
};
