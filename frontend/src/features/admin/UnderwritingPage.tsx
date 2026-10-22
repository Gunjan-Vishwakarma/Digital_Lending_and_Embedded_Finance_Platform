import React, { useState } from 'react';
import { formatCurrency, getRiskTierColor } from '../../utils/helpers';
import type { RiskTier } from '../../types/loan';
import {
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  FileText,
  User,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

interface UnderwritingLoan {
  id: string;
  borrowerName: string;
  email: string;
  principalAmount: number;
  tenureMonths: number;
  purpose: string;
  monthlyIncome: number;
  employment: string;
  creditScore: number;
  defaultProbability: number;
  suggestedAPR: number;
  riskTier: RiskTier;
  submittedAt: string;
  status: 'UNDERWRITING' | 'FUNDING' | 'REJECTED' | 'RETURNED';
  shapFeatures: {
    feature: string;
    impact: number; // positive = decreases risk (improves score), negative = increases risk
    description: string;
  }[];
}

const initialQueue: UnderwritingLoan[] = [
  {
    id: 'LN-9201',
    borrowerName: 'Marcus Bennett',
    email: 'marcus.b@example.com',
    principalAmount: 15000,
    tenureMonths: 24,
    purpose: 'Small Business Equipment Expansion',
    monthlyIncome: 6200,
    employment: 'Founder, Bennett Logistics (4 yrs)',
    creditScore: 718,
    defaultProbability: 4.1,
    suggestedAPR: 9.8,
    riskTier: 'B',
    submittedAt: '2026-10-22T08:30:00Z',
    status: 'UNDERWRITING',
    shapFeatures: [
      { feature: 'Income Stability', impact: 0.28, description: '48 months continuous recurring bank deposits' },
      { feature: 'Low Debt-to-Income', impact: 0.20, description: 'DTI ratio is 22% (below 35% threshold)' },
      { feature: 'Utility History', impact: 0.12, description: 'Zero late payments on 3 utility providers' },
      { feature: 'Credit Inquiries', impact: -0.10, description: '2 recent hard credit inquiries in past 90 days' },
      { feature: 'High Cash Outflow', impact: -0.06, description: 'Discretionary spending spike in August' },
    ],
  },
  {
    id: 'LN-9612',
    borrowerName: 'Carlos Gomez',
    email: 'carlos.g@example.com',
    principalAmount: 8000,
    tenureMonths: 18,
    purpose: 'Commercial Kitchen Fleet Expansion',
    monthlyIncome: 4800,
    employment: 'Catering Director (3 yrs)',
    creditScore: 662,
    defaultProbability: 7.8,
    suggestedAPR: 13.5,
    riskTier: 'C',
    submittedAt: '2026-10-22T06:15:00Z',
    status: 'UNDERWRITING',
    shapFeatures: [
      { feature: 'Consistent Inflow', impact: 0.22, description: 'Weekly e-wallet merchant deposits' },
      { feature: 'Long Account Age', impact: 0.16, description: '6+ years established primary bank checking' },
      { feature: 'Existing Balances', impact: -0.18, description: 'Credit card utilization currently at 58%' },
      { feature: 'Limited Collateral', impact: -0.11, description: 'Unsecured personal loan request' },
    ],
  },
  {
    id: 'LN-9884',
    borrowerName: 'Devon Wright',
    email: 'devon.w@example.com',
    principalAmount: 10000,
    tenureMonths: 12,
    purpose: 'Tech Startup Inventory Bridge Financing',
    monthlyIncome: 7500,
    employment: 'Self-Employed E-Commerce (1.5 yrs)',
    creditScore: 635,
    defaultProbability: 12.4,
    suggestedAPR: 17.2,
    riskTier: 'D',
    submittedAt: '2026-10-21T21:40:00Z',
    status: 'UNDERWRITING',
    shapFeatures: [
      { feature: 'Revenue Growth', impact: 0.25, description: '+40% MoM sales growth on Shopify store' },
      { feature: 'High Working Capital', impact: 0.18, description: 'Healthy inventory asset turnover' },
      { feature: 'Short Bureau Tenure', impact: -0.22, description: 'Less than 2 years of traditional credit bureau files' },
      { feature: 'Volatile Cash Balance', impact: -0.15, description: 'Monthly buffer dips below $1,000 occasionally' },
    ],
  },
];

const UnderwritingPage: React.FC = () => {
  const [loans, setLoans] = useState<UnderwritingLoan[]>(initialQueue);
  const [selectedId, setSelectedId] = useState<string>(initialQueue[0].id);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeLoan = loans.find((l) => l.id === selectedId) || loans[0];

  const handleDecision = (decision: 'FUNDING' | 'REJECTED' | 'RETURNED') => {
    setLoans((prev) =>
      prev.map((l) => (l.id === activeLoan.id ? { ...l, status: decision } : l))
    );

    const labels = {
      FUNDING: `Loan ${activeLoan.id} APPROVED and promoted to Marketplace!`,
      REJECTED: `Loan ${activeLoan.id} DECLINED. FCRA Adverse Action Notice generated.`,
      RETURNED: `Loan ${activeLoan.id} returned to borrower requesting additional documentation.`,
    };

    setActionNotice(labels[decision]);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Admin Underwriting & Credit Risk Suite</h1>
        <p>Review AI-assessed applications, SHAP feature attributions, and make underwriting decisions</p>
      </div>

      {actionNotice && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <CheckCircle size={18} /> {actionNotice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left: Pending Loans Queue */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)' }}>Underwriting Queue</h3>
            <span className="badge badge-warning">{loans.filter((l) => l.status === 'UNDERWRITING').length} Pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {loans.map((loan) => {
              const isSelected = loan.id === activeLoan.id;
              return (
                <div
                  key={loan.id}
                  onClick={() => setSelectedId(loan.id)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: isSelected ? 'var(--color-bg-elevated)' : 'var(--color-bg-secondary)',
                    border: isSelected ? '1px solid var(--color-accent)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{loan.id}</span>
                    <span className={`badge ${
                      loan.status === 'FUNDING' ? 'badge-success' :
                      loan.status === 'REJECTED' ? 'badge-danger' :
                      loan.status === 'RETURNED' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {loan.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{loan.borrowerName}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    {loan.purpose}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                    <span>Amount: <strong>{formatCurrency(loan.principalAmount)}</strong></span>
                    <span className={`tier-badge ${getRiskTierColor(loan.riskTier)}`}>
                      Tier {loan.riskTier} • {loan.creditScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Credit Engine & SHAP Explanation Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Main Inspection Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <h2>{activeLoan.id}</h2>
                  <span className={`tier-badge ${getRiskTierColor(activeLoan.riskTier)}`} style={{ fontSize: 'var(--text-sm)', padding: '2px 10px' }}>
                    Risk Tier {activeLoan.riskTier}
                  </span>
                  <span className="badge badge-info">{activeLoan.status}</span>
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                  Borrower: <strong>{activeLoan.borrowerName}</strong> ({activeLoan.email})
                </div>
              </div>

              {/* Action Buttons */}
              {activeLoan.status === 'UNDERWRITING' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDecision('RETURNED')}
                    title="Return to borrower for missing proof"
                  >
                    <RotateCcw size={14} /> Request Info
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDecision('REJECTED')}
                    title="Decline application"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDecision('FUNDING')}
                    title="Approve and disburse to marketplace"
                  >
                    <CheckCircle size={14} /> Approve to Marketplace
                  </button>
                </div>
              )}
            </div>

            {/* Metrics Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Loan Amount</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{formatCurrency(activeLoan.principalAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>AI Credit Score</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent-hover)' }}>{activeLoan.creditScore} / 850</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Default Probability</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-warning)' }}>{activeLoan.defaultProbability}%</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Suggested APR</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-success)' }}>{activeLoan.suggestedAPR}%</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Monthly Income</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{formatCurrency(activeLoan.monthlyIncome)}</div>
              </div>
            </div>

            {/* SHAP Feature Attributions Visualization */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <Sparkles size={18} color="var(--color-accent-hover)" />
                <h3>SHAP Explainability & Risk Attribution (FCRA / GDPR Compliant)</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                Shows how individual features positively (+) or negatively (-) impacted the model's risk score relative to baseline.
              </p>

              {/* Recharts Horizontal Bar Chart */}
              <div style={{ width: '100%', height: 200, marginBottom: 'var(--space-4)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={activeLoan.shapFeatures}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis
                      type="number"
                      domain={[-0.3, 0.35]}
                      stroke="var(--color-text-muted)"
                      fontSize={11}
                      tickFormatter={(val) => (val > 0 ? `+${val}` : `${val}`)}
                    />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      stroke="var(--color-text-muted)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 12,
                      }}
                      formatter={(val: number) => [val > 0 ? `+${val.toFixed(2)} impact` : `${val.toFixed(2)} impact`, 'SHAP Weight']}
                    />
                    <Bar dataKey="impact" radius={[4, 4, 4, 4]}>
                      {activeLoan.shapFeatures.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.impact >= 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Feature Descriptions List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2)' }}>
                {activeLoan.shapFeatures.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: f.impact >= 0 ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
                        color: f.impact >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {f.impact >= 0 ? `+${f.impact}` : `${f.impact}`}
                    </span>
                    <div>
                      <strong>{f.feature}:</strong>{' '}
                      <span style={{ color: 'var(--color-text-secondary)' }}>{f.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment & Alternative Data Consent Card */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                Verified Employment & Data Consents:
              </div>
              <div>• Employment: {activeLoan.employment} (Plaid payroll verified)</div>
              <div>• Alternative Data: Consented to telecom + utility records (24 mo punctuality index: 96.4%)</div>
              <div>• Biometric Identity: Government ID match score 98.4% (Persona API inquiry: <code>inq_77412</code>)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderwritingPage;
