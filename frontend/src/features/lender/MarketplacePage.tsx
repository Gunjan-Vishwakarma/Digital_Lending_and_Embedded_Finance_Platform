import React, { useState } from 'react';
import { formatCurrency, formatPercentage, getRiskTierColor } from '../../utils/helpers';
import type { RiskTier } from '../../types/loan';
import {
  Store,
  Filter,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MarketplaceLoan {
  id: string;
  purpose: string;
  borrowerName: string;
  creditScore: number;
  riskTier: RiskTier;
  requestedAmount: number;
  fundedAmount: number;
  grossYield: number; // APR %
  tenureMonths: number;
  daysRemaining: number;
  shapHighlights: string[];
}

const mockMarketplaceLoans: MarketplaceLoan[] = [
  {
    id: 'LN-9201',
    purpose: 'Small Business Equipment Expansion',
    borrowerName: 'Marcus Bennett',
    creditScore: 718,
    riskTier: 'B',
    requestedAmount: 15000,
    fundedAmount: 11250,
    grossYield: 9.8,
    tenureMonths: 24,
    daysRemaining: 4,
    shapHighlights: ['Income Stability (+0.28)', 'Low Debt-to-Income (+0.20)', '3+ yrs Utility History (+0.12)'],
  },
  {
    id: 'LN-9450',
    purpose: 'Medical Clinic Diagnostic Upgrade',
    borrowerName: 'Dr. Rachel Patel',
    creditScore: 785,
    riskTier: 'A',
    requestedAmount: 25000,
    fundedAmount: 21500,
    grossYield: 6.8,
    tenureMonths: 36,
    daysRemaining: 7,
    shapHighlights: ['Prime Credit Tier (+0.35)', 'Substantial Bank Balances (+0.28)', 'Zero Overdrafts (+0.15)'],
  },
  {
    id: 'LN-9612',
    purpose: 'Commercial Kitchen Fleet Expansion',
    borrowerName: 'Carlos Gomez',
    creditScore: 662,
    riskTier: 'C',
    requestedAmount: 8000,
    fundedAmount: 3200,
    grossYield: 13.5,
    tenureMonths: 18,
    daysRemaining: 11,
    shapHighlights: ['Strong Revenue Consistency (+0.22)', 'Higher Debt Ratio (-0.14)', 'Established Merchant Profile (+0.16)'],
  },
  {
    id: 'LN-9730',
    purpose: 'Renewable Solar Roof Installation',
    borrowerName: 'Claire Tremblay',
    creditScore: 742,
    riskTier: 'B',
    requestedAmount: 12000,
    fundedAmount: 4800,
    grossYield: 8.5,
    tenureMonths: 24,
    daysRemaining: 9,
    shapHighlights: ['Punctual Utility Record (+0.24)', 'Steady Employment Tenure (+0.18)', 'Low Credit Inquiries (+0.10)'],
  },
  {
    id: 'LN-9884',
    purpose: 'Tech Startup Inventory Bridge Financing',
    borrowerName: 'Devon Wright',
    creditScore: 635,
    riskTier: 'D',
    requestedAmount: 10000,
    fundedAmount: 2500,
    grossYield: 17.2,
    tenureMonths: 12,
    daysRemaining: 14,
    shapHighlights: ['High Margin E-Commerce (+0.30)', 'Short Traditional History (-0.18)', 'Rapid Revenue Growth (+0.20)'],
  },
  {
    id: 'LN-9921',
    purpose: 'Boutique Hotel Energy Retrofit',
    borrowerName: 'Julianne Scott',
    creditScore: 760,
    riskTier: 'A',
    requestedAmount: 30000,
    fundedAmount: 27000,
    grossYield: 7.1,
    tenureMonths: 36,
    daysRemaining: 3,
    shapHighlights: ['Asset-Backed Security (+0.32)', 'Substantial Cash Reserves (+0.25)', 'Exemplary Repayment History (+0.19)'],
  },
];

const MarketplacePage: React.FC = () => {
  const [loans, setLoans] = useState<MarketplaceLoan[]>(mockMarketplaceLoans);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [minYield, setMinYield] = useState<number>(0);

  // Funding Modal State
  const [selectedLoan, setSelectedLoan] = useState<MarketplaceLoan | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundSuccess, setFundSuccess] = useState(false);
  const [lastIdempotencyKey, setLastIdempotencyKey] = useState('');

  const filteredLoans = loans.filter((l) => {
    if (selectedTier !== 'ALL' && l.riskTier !== selectedTier) return false;
    if (l.grossYield < minYield) return false;
    return true;
  });

  const handleOpenFundModal = (loan: MarketplaceLoan) => {
    setSelectedLoan(loan);
    const remaining = loan.requestedAmount - loan.fundedAmount;
    setInvestAmount(Math.min(1000, remaining).toString());
    setLastIdempotencyKey(uuidv4());
    setFundSuccess(false);
  };

  const handleConfirmInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount < 100) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setLoans((prev) =>
        prev.map((l) => {
          if (l.id === selectedLoan.id) {
            const newFunded = Math.min(l.requestedAmount, l.fundedAmount + amount);
            return { ...l, fundedAmount: newFunded };
          }
          return l;
        })
      );
      setIsSubmitting(false);
      setFundSuccess(true);
      setTimeout(() => {
        setSelectedLoan(null);
        setFundSuccess(false);
      }, 1800);
    }, 1200);
  };

  const parsedInvestAmount = parseFloat(investAmount) || 0;
  const platformFee = 1.0; // 1% servicing fee
  const netYield = selectedLoan ? Math.max(0, selectedLoan.grossYield - platformFee) : 0;
  const projectedMonthlyReturn = selectedLoan
    ? (parsedInvestAmount * (selectedLoan.grossYield / 100 / 12) + (parsedInvestAmount / selectedLoan.tenureMonths))
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Lender & Investor Marketplace</h1>
          <p>Co-fund vetted loans with AI risk scoring, automated escrow, and predictable cashflows</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span className="badge badge-info" style={{ padding: 'var(--space-2) var(--space-3)' }}>
            Available Liquidity: {formatCurrency(24580.50)}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          {/* Risk Tier Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Risk Tier:
            </span>
            {['ALL', 'A', 'B', 'C', 'D'].map((tier) => (
              <button
                key={tier}
                type="button"
                className={`btn btn-sm ${selectedTier === tier ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedTier(tier)}
              >
                {tier === 'ALL' ? 'All Tiers' : `Tier ${tier}`}
              </button>
            ))}
          </div>

          {/* Yield Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Min Yield: {minYield}%
            </span>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={minYield}
              onChange={(e) => setMinYield(Number(e.target.value))}
              style={{ accentColor: 'var(--color-accent)', width: 120 }}
            />
          </div>
        </div>
      </div>

      {/* Loan Opportunity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredLoans.map((loan) => {
          const remainingNeeded = loan.requestedAmount - loan.fundedAmount;
          const fundedPercent = Math.round((loan.fundedAmount / loan.requestedAmount) * 100);

          return (
            <div key={loan.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{loan.id}</span>
                    <span className={`tier-badge ${getRiskTierColor(loan.riskTier)}`}>
                      Tier {loan.riskTier}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    {loan.purpose}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Borrower: {loan.borrowerName} • Credit Score: <strong>{loan.creditScore}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-success)' }}>
                    {loan.grossYield}%
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>APR Yield</div>
                </div>
              </div>

              {/* SHAP Regulatory Highlights */}
              <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-hover)', marginBottom: '2px' }}>
                  <Sparkles size={12} /> AI Scoring & SHAP Explanations:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                  {loan.shapHighlights.map((hl, i) => (
                    <span key={i} style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)' }}>
                      {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Funding Progress Bar */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Funding Progress</span>
                  <strong>{formatCurrency(loan.fundedAmount)} of {formatCurrency(loan.requestedAmount)} ({fundedPercent}%)</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${fundedPercent}%`, background: 'linear-gradient(90deg, var(--color-accent), #06b6d4)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  <span>{formatCurrency(remainingNeeded)} remaining</span>
                  <span><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{loan.daysRemaining} days left</span>
                </div>
              </div>

              {/* Loan Details Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>Tenure: <strong style={{ color: 'var(--color-text-primary)' }}>{loan.tenureMonths} Months</strong></div>
                <div>Min Ticket: <strong style={{ color: 'var(--color-text-primary)' }}>$100</strong></div>
              </div>

              {/* Fund Action */}
              <button
                className="btn btn-primary btn-md"
                style={{ marginTop: 'auto', width: '100%' }}
                onClick={() => handleOpenFundModal(loan)}
                disabled={remainingNeeded <= 0}
              >
                {remainingNeeded <= 0 ? '100% Fully Funded' : `Fund Loan (Commit Capital)`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Fund Loan Commitment Modal */}
      {selectedLoan && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div>
                <h3>Fund Loan Opportunity — {selectedLoan.id}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {selectedLoan.purpose} • Tier {selectedLoan.riskTier}
                </div>
              </div>
              <button className="btn btn-ghost btn-icon sm" onClick={() => setSelectedLoan(null)}>
                <X size={18} />
              </button>
            </div>

            {fundSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-success-muted)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                  <CheckCircle size={36} />
                </div>
                <h3>Investment Committed!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                  Successfully allocated {formatCurrency(parsedInvestAmount)} to Escrow for {selectedLoan.id}.
                </p>
                <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Ledger Txn: ESCROW_LOCK_{Date.now().toString().slice(-8)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmInvestment}>
                <div className="form-group">
                  <label className="form-label">Investment Amount (USD)</label>
                  <input
                    type="number"
                    min="100"
                    max={selectedLoan.requestedAmount - selectedLoan.fundedAmount}
                    step="50"
                    className="form-input"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    required
                    autoFocus
                  />
                  <span className="form-helper">
                    Remaining to fund: {formatCurrency(selectedLoan.requestedAmount - selectedLoan.fundedAmount)} (Min: $100)
                  </span>
                </div>

                {/* Returns Projection Card */}
                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                    Projected Cashflow & Yield
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Gross Interest Rate</span>
                    <strong>{selectedLoan.grossYield}% APR</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Platform Servicing Fee</span>
                    <span style={{ color: 'var(--color-warning)' }}>-1.0%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Effective Net Yield</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{netYield.toFixed(1)}% APR</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: 'var(--border-subtle)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Est. Monthly Payout</span>
                    <strong style={{ color: 'var(--color-info)' }}>{formatCurrency(projectedMonthlyReturn)}/mo</strong>
                  </div>
                </div>

                {/* Double Entry Escrow Notice */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--color-accent-hover)' }}>
                  <ShieldCheck size={14} />
                  <span>Funds are locked into ESCROW via double-entry journal until 100% funded.</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedLoan(null)} disabled={isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? <span className="spinner" /> : `Commit ${formatCurrency(parsedInvestAmount)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
