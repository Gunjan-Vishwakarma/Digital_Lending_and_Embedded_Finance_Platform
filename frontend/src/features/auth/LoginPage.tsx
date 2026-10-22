import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { loginDemoUser } from '../../store/slices/authSlice';
import type { UserRole } from '../../types/user';
import { CreditCard, Eye, EyeOff, ArrowRight, Shield, Sparkles, User, Briefcase } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, resetError } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    const result = await login({ email, password });
    if (result.meta?.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    dispatch(loginDemoUser(role));
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
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
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <CreditCard size={28} color="white" />
            </div>
            <h2>NexFin Capital</h2>
            <p>Digital Lending & Embedded Finance Platform</p>
          </div>

          {/* Quick Demo Personas */}
          <div
            style={{
              padding: 'var(--space-3)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-accent-hover)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Sparkles size={14} /> Quick Demo Personas (1-Click)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('BORROWER')}
                style={{ justifyContent: 'flex-start', fontSize: 'var(--text-xs)' }}
              >
                <User size={14} style={{ color: 'var(--color-info)' }} /> Borrower
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('LENDER')}
                style={{ justifyContent: 'flex-start', fontSize: 'var(--text-xs)' }}
              >
                <Briefcase size={14} style={{ color: 'var(--color-success)' }} /> Lender
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('ADMIN')}
                style={{ justifyContent: 'flex-start', fontSize: 'var(--text-xs)' }}
              >
                <Shield size={14} style={{ color: 'var(--color-warning)' }} /> Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('MERCHANT')}
                style={{ justifyContent: 'flex-start', fontSize: 'var(--text-xs)' }}
              >
                <CreditCard size={14} style={{ color: '#ec4899' }} /> Merchant
              </button>
            </div>
          </div>

          {error && (
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
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 'var(--space-5)',
              }}
            >
              <Link
                to="/forgot-password"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
