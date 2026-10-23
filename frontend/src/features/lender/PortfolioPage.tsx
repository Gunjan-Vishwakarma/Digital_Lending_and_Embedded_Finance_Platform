import React from 'react';
import { formatCurrency, getRiskTierColor } from '../../utils/helpers';
import {
  TrendingUp,
  DollarSign,
  Activity,
  ShieldAlert,
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

interface FundedInvestment {
  id: string;
  loanId: string;
  borrower: string;
  purpose: string;
  riskTier: 'A' | 'B' | 'C' | 'D';
  committedAmount: number;
  ownershipPercent: number;
  principalReturned: number;
  interestEarned: number;
  netYield: number;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  nextPayoutDate: string;
}

const mockInvestments: FundedInvestment[] = [
  {
    id: 'INV-102',
    loanId: 'LN-8492',
    borrower: 'Elena Rostova',
    purpose: 'Debt Consolidation',
    riskTier: 'B',
    committedAmount: 2500,
    ownershipPercent: 25.0,
    principalReturned: 575.30,
    interestEarned: 106.25,
    netYield: 7.5,
    status: 'ACTIVE',
    nextPayoutDate: '2026-10-28',
  },
  {
    id: 'INV-105',
    loanId: 'LN-7819',
    borrower: 'Marcus Bennett',
    purpose: 'Home Improvement',
    riskTier: 'A',
    committedAmount: 1500,
    ownershipPercent: 30.0,
    principalReturned: 476.80,
    interestEarned: 54.00,
    netYield: 6.2,
    status: 'ACTIVE',
    nextPayoutDate: '2026-11-05',
  },
  {
    id: 'INV-098',
    loanId: 'LN-6104',
    borrower: 'David Cho',
    purpose: 'Vehicle Repair',
    riskTier: 'A',
    committedAmount: 1000,
    ownershipPercent: 33.3,
    principalReturned: 1000.00,
    interestEarned: 68.00,
    netYield: 6.8,
    status: 'CLOSED',
    nextPayoutDate: 'Completed',
  },
  {
    id: 'INV-110',
    loanId: 'LN-9450',
    borrower: 'Dr. Rachel Patel',
    purpose: 'Medical Clinic Diagnostic Upgrade',
    riskTier: 'A',
    committedAmount: 5000,
    ownershipPercent: 20.0,
    principalReturned: 280.00,
    interestEarned: 85.00,
    netYield: 5.8,
    status: 'ACTIVE',
    nextPayoutDate: '2026-11-12',
  },
  {
    id: 'INV-114',
    loanId: 'LN-9730',
    borrower: 'Claire Tremblay',
    purpose: 'Solar Installation',
    riskTier: 'B',
    committedAmount: 3000,
    ownershipPercent: 25.0,
    principalReturned: 125.00,
    interestEarned: 63.75,
    netYield: 7.5,
    status: 'ACTIVE',
    nextPayoutDate: '2026-11-18',
  },
];

const returnsHistory = [
  { month: 'May', principal: 620, interest: 145 },
  { month: 'Jun', principal: 780, interest: 190 },
  { month: 'Jul', principal: 910, interest: 235 },
  { month: 'Aug', principal: 1140, interest: 280 },
  { month: 'Sep', principal: 1350, interest: 320 },
  { month: 'Oct (est)', principal: 1480, interest: 377 },
];

const PortfolioPage: React.FC = () => {
  const totalCommitted = mockInvestments.reduce((acc, inv) => acc + inv.committedAmount, 0);
  const totalPrincipalReturned = mockInvestments.reduce((acc, inv) => acc + inv.principalReturned, 0);
  const totalInterestEarned = mockInvestments.reduce((acc, inv) => acc + inv.interestEarned, 0);
  const weightedYield =
    mockInvestments.reduce((acc, inv) => acc + inv.netYield * inv.committedAmount, 0) / totalCommitted;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Lender Portfolio Analytics</h1>
        <p>Monitor your active capital allocations, monthly interest yields, and cash distributions</p>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(totalCommitted)}</div>
          <div className="stat-card-label">Total Capital Invested</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            Across {mockInvestments.length} loan syndications
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-value">{weightedYield.toFixed(2)}% APR</div>
          <div className="stat-card-label">Weighted Average Net Yield</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Net of 1.0% platform servicing fee
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-info-muted)', color: 'var(--color-info)' }}>
            <Activity size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(totalInterestEarned)}</div>
          <div className="stat-card-label">Total Interest Income Earned</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-info)' }}>
            + {formatCurrency(totalPrincipalReturned)} principal returned
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
            <ShieldAlert size={22} />
          </div>
          <div className="stat-card-value">0.00%</div>
          <div className="stat-card-label">Portfolio Default Rate</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            100% on-time servicing
          </div>
        </div>
      </div>

      {/* Cashflow Recharts Area Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3>Monthly Cashflow & Return Inflow</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
              Stacked monthly principal recoveries and accrued interest payouts
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} /> Principal Return
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> Interest Income
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={returnsHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                }}
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, '']}
              />
              <Area
                type="monotone"
                dataKey="principal"
                name="Principal"
                stackId="1"
                stroke="#6366f1"
                fill="url(#gradPrincipal)"
              />
              <Area
                type="monotone"
                dataKey="interest"
                name="Interest Income"
                stackId="1"
                stroke="#10b981"
                fill="url(#gradInterest)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Loan Syndications Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3>Active Loan Commitments & Syndications</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
              Individual loan participations and monthly repayment tracking
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Loan Ref</th>
                <th>Borrower & Purpose</th>
                <th>Risk Tier</th>
                <th style={{ textAlign: 'right' }}>Committed Capital</th>
                <th style={{ textAlign: 'right' }}>Share %</th>
                <th style={{ textAlign: 'right' }}>Principal Returned</th>
                <th style={{ textAlign: 'right' }}>Interest Earned</th>
                <th style={{ textAlign: 'center' }}>Net Yield</th>
                <th>Next Payout</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInvestments.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-accent-hover)' }}>
                      {inv.loanId}
                    </span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{inv.id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{inv.borrower}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{inv.purpose}</div>
                  </td>
                  <td>
                    <span className={`tier-badge ${getRiskTierColor(inv.riskTier)}`}>
                      Tier {inv.riskTier}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(inv.committedAmount)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                    {inv.ownershipPercent}%
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-info)' }}>
                    {formatCurrency(inv.principalReturned)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: 600 }}>
                    +{formatCurrency(inv.interestEarned)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-success)' }}>
                    {inv.netYield}%
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {inv.nextPayoutDate}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${inv.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
