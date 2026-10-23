import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Mock data for the dashboard
const revenueData = [
  { month: 'Jan', revenue: 12400, loans: 8 },
  { month: 'Feb', revenue: 18200, loans: 12 },
  { month: 'Mar', revenue: 15800, loans: 10 },
  { month: 'Apr', revenue: 22100, loans: 15 },
  { month: 'May', revenue: 28500, loans: 19 },
  { month: 'Jun', revenue: 31200, loans: 22 },
  { month: 'Jul', revenue: 27800, loans: 18 },
  { month: 'Aug', revenue: 35600, loans: 25 },
  { month: 'Sep', revenue: 42100, loans: 30 },
  { month: 'Oct', revenue: 38900, loans: 27 },
];

const recentTransactions = [
  { id: 1, type: 'EMI Payment', amount: -454.36, date: '2026-10-22', status: 'completed', loan: 'Loan #1042' },
  { id: 2, type: 'Deposit', amount: 5000, date: '2026-10-21', status: 'completed', loan: 'Wallet' },
  { id: 3, type: 'Loan Disbursement', amount: 10000, date: '2026-10-20', status: 'completed', loan: 'Loan #1041' },
  { id: 4, type: 'EMI Payment', amount: -312.50, date: '2026-10-19', status: 'pending', loan: 'Loan #1039' },
  { id: 5, type: 'Investment Return', amount: 892.30, date: '2026-10-18', status: 'completed', loan: 'Portfolio' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const statCards = [
    {
      label: 'Total Balance',
      value: formatCurrency(24580.50),
      trend: '+12.5%',
      trendDir: 'up' as const,
      icon: <DollarSign size={22} />,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-muted)',
    },
    {
      label: 'Active Loans',
      value: '3',
      trend: '+1 this month',
      trendDir: 'up' as const,
      icon: <FileText size={22} />,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-muted)',
    },
    {
      label: user?.role === 'LENDER' ? 'Portfolio Yield' : 'Next EMI Due',
      value: user?.role === 'LENDER' ? '8.2% APR' : formatCurrency(454.36),
      trend: user?.role === 'LENDER' ? '+0.3% vs last month' : 'Due Oct 28',
      trendDir: 'up' as const,
      icon: user?.role === 'LENDER' ? <TrendingUp size={22} /> : <Clock size={22} />,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-muted)',
    },
    {
      label: 'Credit Score',
      value: '742',
      trend: '+18 points',
      trendDir: 'up' as const,
      icon: <Activity size={22} />,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-muted)',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.firstName || 'User'}</h1>
        <p>Here's an overview of your financial activity</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="stat-card"
            style={{ '--stat-color': stat.color } as React.CSSProperties}
          >
            <div
              className="stat-card-icon"
              style={{ background: stat.bgColor, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
            <div className={`stat-card-trend ${stat.trendDir}`}>
              {stat.trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Revenue/Activity Chart */}
        <div className="chart-container">
          <h3>Financial Activity</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Monthly overview of transactions
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-elevated)',
                    border: 'var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Transactions</div>
              <div className="card-subtitle">Last 5 activities</div>
            </div>
            <button className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-glass)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: tx.amount > 0 ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tx.amount > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {tx.amount > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{tx.type}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {tx.loan} · {tx.date}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: tx.amount > 0 ? 'var(--color-success)' : 'var(--color-text-primary)',
                    }}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                    {tx.status === 'completed' ? (
                      <CheckCircle size={12} style={{ color: 'var(--color-success)' }} />
                    ) : (
                      <Clock size={12} style={{ color: 'var(--color-warning)' }} />
                    )}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {user?.role === 'BORROWER' && (
            <>
              <a href="/loans/apply" className="btn btn-primary">
                <FileText size={16} /> Apply for Loan
              </a>
              <a href="/wallet" className="btn btn-secondary">
                <DollarSign size={16} /> Make Payment
              </a>
            </>
          )}
          {user?.role === 'LENDER' && (
            <>
              <a href="/marketplace" className="btn btn-primary">
                <Users size={16} /> Browse Marketplace
              </a>
              <a href="/auto-invest" className="btn btn-secondary">
                <Activity size={16} /> Auto-Invest Rules
              </a>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <a href="/admin/underwriting" className="btn btn-primary">
                <FileText size={16} /> Review Queue
              </a>
              <a href="/admin/analytics" className="btn btn-secondary">
                <Activity size={16} /> Platform Analytics
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
