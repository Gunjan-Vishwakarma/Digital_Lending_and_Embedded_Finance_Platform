import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user';
import { CreditCard, Eye, EyeOff, ArrowRight, User, Briefcase } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register, isLoading, error, resetError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BORROWER' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    setLocalError('');

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await register(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const displayError = localError || error;

  const roleOptions: { value: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'BORROWER', label: 'Borrower', icon: <User size={20} />, desc: 'Apply for loans & financing' },
    { value: 'LENDER', label: 'Investor', icon: <Briefcase size={20} />, desc: 'Fund loans & earn returns' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in" style={{ maxWidth: 480 }}>
        <div className="auth-card">
          <div className="auth-logo">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={28} color="white" />
            </div>
            <h2>Create Account</h2>
            <p>Join the NexFin lending platform</p>
          </div>

          {displayError && (
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-danger-muted)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I want to</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('role', opt.value)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: formData.role === opt.value
                        ? '2px solid var(--color-accent)'
                        : 'var(--border-default)',
                      background: formData.role === opt.value
                        ? 'var(--color-accent-muted)'
                        : 'var(--color-bg-input)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      {opt.icon}
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{opt.label}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-first-name">First Name</label>
                <input
                  id="register-first-name"
                  type="text"
                  className="form-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="register-last-name">Last Name</label>
                <input
                  id="register-last-name"
                  type="text"
                  className="form-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => update('email', e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  style={{ paddingRight: 'var(--space-10)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
              disabled={isLoading}
              id="register-submit-btn"
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
