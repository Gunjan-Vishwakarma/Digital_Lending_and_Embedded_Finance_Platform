import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';

const monthlyOrigination = [
  { month: 'Jan', volume: 280000, funded: 260000 },
  { month: 'Feb', volume: 340000, funded: 320000 },
  { month: 'Mar', volume: 410000, funded: 395000 },
  { month: 'Apr', volume: 490000, funded: 470000 },
  { month: 'May', volume: 580000, funded: 560000 },
  { month: 'Jun', volume: 640000, funded: 625000 },
  { month: 'Jul', volume: 720000, funded: 695000 },
  { month: 'Aug', volume: 810000, funded: 790000 },
  { month: 'Sep', volume: 920000, funded: 890000 },
  { month: 'Oct (MTD)', volume: 1040000, funded: 995000 },
];

const riskDistribution = [
  { tier: 'Tier A (Prime)', loans: 142, volume: 1850000, color: '#10b981' },
  { tier: 'Tier B (Near-Prime)', loans: 188, volume: 1620000, color: '#06b6d4' },
  { tier: 'Tier C (Standard)', loans: 94, volume: 840000, color: '#f59e0b' },
  { tier: 'Tier D (Subprime)', loans: 32, volume: 290000, color: '#f97316' },
];

const PlatformAnalyticsPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Platform Executive Analytics & Risk Metrics</h1>
        <p>Real-time loan origination velocity, risk tier distribution, and capital deployment telemetry</p>
      </div>

      {/* Primary KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(6230000)}</div>
          <div className="stat-card-label">Cumulative Loan Origination</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            +22.4% vs last quarter
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-info-muted)', color: 'var(--color-info)' }}>
            <Layers size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(3840000)}</div>
          <div className="stat-card-label">Active Outstanding Portfolio</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            456 active loan contracts
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="stat-card-value">1.18%</div>
          <div className="stat-card-label">System-Wide Default Rate</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            Industry avg: 3.50% (AI advantage)
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(248600)}</div>
          <div className="stat-card-label">Net Platform Fee Revenue</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            1.0% origination & servicing take
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Origination Growth Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3>Monthly Origination & Funding Velocity</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
                Application volume vs successfully funded capital
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOrigination} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--color-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="volume" name="Requested" stroke="#6366f1" fill="url(#volGrad)" />
                <Area type="monotone" dataKey="funded" name="Funded" stroke="#10b981" fill="url(#fundGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Tier Exposure Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3>Portfolio Risk Tier Exposure</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
                Capital distribution by credit risk classification
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="tier" stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="var(--color-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Total Volume']}
                />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform Health Indicators */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Operational Health & Regulatory Ratios</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Average Time-to-Fund</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-accent-hover)', marginTop: '2px' }}>
              18.4 Hours
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>From underwriting approval to 100% funded</div>
          </div>

          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>On-Time Repayment Ratio</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)', marginTop: '2px' }}>
              98.82%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Less than 30 days delinquency</div>
          </div>

          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>KYC Pass Rate</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-info)', marginTop: '2px' }}>
              94.6%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Persona API automated biometric verification</div>
          </div>

          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Active Registered Users</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: '#a855f7', marginTop: '2px' }}>
              12,480
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>8,210 Borrowers • 4,120 Lenders • 150 Merchants</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalyticsPage;
