import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { loginDemoUser } from '../../store/slices/authSlice';
import type { UserRole } from '../../types/user';
import {
  Bell,
  Search,
  LogOut,
  User,
  ShoppingBag,
  ChevronDown,
  Shield,
  Briefcase,
  CreditCard,
  Check,
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    dispatch(loginDemoUser(role));
    setShowRoleDropdown(false);
    navigate('/dashboard');
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'var(--color-warning)';
      case 'LENDER':
        return 'var(--color-success)';
      case 'MERCHANT':
        return '#ec4899';
      default:
        return 'var(--color-info)';
    }
  };

  return (
    <header className={`top-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <div className="header-search">
          <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input type="text" placeholder="Search loans, transactions, or users..." id="header-search-input" />
        </div>

        {/* Embedded BNPL SDK Shortcut */}
        <Link
          to="/bnpl-demo"
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            borderColor: 'rgba(236, 72, 153, 0.4)',
            color: '#f472b6',
          }}
          title="Interactive Embedded BNPL Checkout Demo"
        >
          <ShoppingBag size={14} /> BNPL Demo Store
        </Link>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <button className="btn btn-ghost btn-icon notification-bell" id="notification-bell-btn">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge-count">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-3)',
              background: 'var(--color-bg-tertiary)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
            id="role-switcher-toggle"
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: getRoleBadgeColor(user?.role),
              }}
            />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
              {user?.role || 'BORROWER'}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: 200,
                background: 'var(--color-bg-card)',
                border: 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-2)',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  padding: 'var(--space-2)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Switch Persona
              </div>

              {[
                { role: 'BORROWER' as const, label: 'Borrower', icon: <User size={14} /> },
                { role: 'LENDER' as const, label: 'Lender / Investor', icon: <Briefcase size={14} /> },
                { role: 'ADMIN' as const, label: 'Admin & Compliance', icon: <Shield size={14} /> },
                { role: 'MERCHANT' as const, label: 'Merchant', icon: <CreditCard size={14} /> },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSwitch(item.role)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-2) var(--space-3)',
                    background: user?.role === item.role ? 'var(--color-bg-elevated)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: user?.role === item.role ? 'var(--color-accent-hover)' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {item.icon} {item.label}
                  </div>
                  {user?.role === item.role && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={18} color="white" />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email?.split('@')[0] || 'User'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          className="btn btn-ghost btn-icon sm"
          onClick={() => logout()}
          title="Logout"
          id="logout-btn"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
