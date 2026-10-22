import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  BarChart3,
  Store,
  Shield,
  Users,
  CreditCard,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  ShoppingBag,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const borrowerLinks: NavItem[] = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/loans/apply', icon: <FileText size={20} />, label: 'Apply for Loan' },
    { to: '/loans', icon: <ClipboardList size={20} />, label: 'My Loans' },
    { to: '/wallet', icon: <Wallet size={20} />, label: 'Wallet & Ledger' },
  ];

  const lenderLinks: NavItem[] = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/marketplace', icon: <Store size={20} />, label: 'Marketplace' },
    { to: '/portfolio', icon: <TrendingUp size={20} />, label: 'Portfolio' },
    { to: '/auto-invest', icon: <Target size={20} />, label: 'Auto-Invest' },
    { to: '/wallet', icon: <Wallet size={20} />, label: 'Wallet & Ledger' },
  ];

  const adminLinks: NavItem[] = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/underwriting', icon: <Shield size={20} />, label: 'Underwriting Queue' },
    { to: '/admin/kyc', icon: <Users size={20} />, label: 'KYC / AML Review' },
    { to: '/admin/audit', icon: <ClipboardList size={20} />, label: 'Audit Trail' },
    { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Platform Analytics' },
    { to: '/wallet', icon: <Wallet size={20} />, label: 'Platform Ledger' },
  ];

  const merchantLinks: NavItem[] = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/bnpl-demo', icon: <ShoppingBag size={20} />, label: 'BNPL Checkout SDK' },
    { to: '/wallet', icon: <Wallet size={20} />, label: 'Settlement Wallet' },
  ];

  const getNavLinks = (): NavItem[] => {
    switch (user?.role) {
      case 'LENDER':
        return lenderLinks;
      case 'ADMIN':
        return adminLinks;
      case 'MERCHANT':
        return merchantLinks;
      case 'BORROWER':
      default:
        return borrowerLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <CreditCard size={22} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            NexFin
            <span>Fintech Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-group">
          {!collapsed && <div className="sidebar-nav-group-label">Main Menu</div>}
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive || location.pathname === item.to ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Embedded SDK Demo Shortcut for all */}
        <div className="sidebar-nav-group">
          {!collapsed && <div className="sidebar-nav-group-label">Embedded Finance</div>}
          <NavLink
            to="/bnpl-demo"
            className={({ isActive }) =>
              `sidebar-link ${isActive || location.pathname === '/bnpl-demo' ? 'active' : ''}`
            }
            title={collapsed ? 'BNPL Checkout Demo' : undefined}
            style={{ color: '#f472b6' }}
          >
            <span className="sidebar-link-icon"><ShoppingBag size={20} /></span>
            {!collapsed && <span>BNPL Checkout SDK</span>}
          </NavLink>
        </div>

        <div className="sidebar-nav-group" style={{ marginTop: 'auto' }}>
          {!collapsed && <div className="sidebar-nav-group-label">Preferences</div>}
          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon"><Settings size={20} /></span>
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar-footer">
        <button
          className="btn btn-ghost btn-icon"
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span style={{ fontSize: 'var(--text-sm)' }}>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
