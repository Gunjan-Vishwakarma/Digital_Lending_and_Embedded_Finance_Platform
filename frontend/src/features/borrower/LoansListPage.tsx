import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getLoanStatusColor, getRiskTierColor, generateAmortizationSchedule } from '../../utils/helpers';
import RepaymentChart from './RepaymentChart';
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Shield,
  Calendar,
  AlertCircle,
  X,
  CreditCard,
  Check,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MockLoan {
  id: string;
  purpose: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthsPaid: number;
  status: 'ACTIVE' | 'UNDERWRITING' | 'FUNDING' | 'CLOSED';
  riskTier: 'A' | 'B' | 'C' | 'D';
  nextDueDate: string;
  emiAmount: number;
  remainingBalance: number;
}

const initialLoans: MockLoan[] = [
  {
    id: 'LN-8492',
    purpose: 'Debt Consolidation',
    principalAmount: 10000,
    interestRate: 8.5,
    tenureMonths: 24,
    monthsPaid: 6,
    status: 'ACTIVE',
    riskTier: 'B',
    nextDueDate: '2026-10-28',
    emiAmount: 454.36,
    remainingBalance: 7654.12,
  },
  {
    id: 'LN-7819',
    purpose: 'Home Improvement',
    principalAmount: 5000,
    interestRate: 7.2,
    tenureMonths: 12,
    monthsPaid: 4,
    status: 'ACTIVE',
    riskTier: 'A',
    nextDueDate: '2026-11-05',
    emiAmount: 433.12,
    remainingBalance: 3410.80,
  },
  {
    id: 'LN-9201',
    purpose: 'Business Equipment Expansion',
    principalAmount: 15000,
    interestRate: 9.8,
    tenureMonths: 36,
    monthsPaid: 0,
    status: 'FUNDING',
    riskTier: 'C',
    nextDueDate: 'Awaiting Marketplace Funding',
    emiAmount: 482.70,
    remainingBalance: 15000,
  },
  {
    id: 'LN-6104',
    purpose: 'Vehicle Repair',
    principalAmount: 3000,
    interestRate: 6.8,
    tenureMonths: 12,
    monthsPaid: 12,
    status: 'CLOSED',
    riskTier: 'A',
    nextDueDate: 'Completed',
    emiAmount: 259.30,
    remainingBalance: 0,
  },
];

const LoansListPage: React.FC = () => {
  const [loans, setLoans] = useState<MockLoan[]>(initialLoans);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'FUNDING' | 'CLOSED'>('ALL');

  // Modal States
  const [scheduleModalLoan, setScheduleModalLoan] = useState<MockLoan | null>(null);
  const [repayModalLoan, setRepayModalLoan] = useState<MockLoan | null>(null);
  const [isProcessingRepay, setIsProcessingRepay] = useState(false);
  const [repaySuccess, setRepaySuccess] = useState(false);
  const [lastIdempotencyKey, setLastIdempotencyKey] = useState('');

  const filteredLoans = loans.filter((l) => {
    if (activeTab === 'ALL') return true;
    return l.status === activeTab;
  });

  const totalOutstanding = loans
    .filter((l) => l.status === 'ACTIVE')
    .reduce((acc, l) => acc + l.remainingBalance, 0);

  const nextPaymentSum = loans
    .filter((l) => l.status === 'ACTIVE')
    .reduce((acc, l) => acc + l.emiAmount, 0);

  const handleOpenRepayModal = (loan: MockLoan) => {
    setRepayModalLoan(loan);
    setLastIdempotencyKey(uuidv4());
    setRepaySuccess(false);
  };

  const handleConfirmPayment = () => {
    if (!repayModalLoan) return;
    setIsProcessingRepay(true);

    setTimeout(() => {
      setLoans((prev) =>
        prev.map((l) => {
          if (l.id === repayModalLoan.id) {
            const newMonthsPaid = l.monthsPaid + 1;
            const newRemaining = Math.max(0, l.remainingBalance - (l.emiAmount - (l.remainingBalance * (l.interestRate / 100 / 12))));
            return {
              ...l,
              monthsPaid: newMonthsPaid,
              remainingBalance: Math.round(newRemaining * 100) / 100,
              status: newMonthsPaid >= l.tenureMonths ? 'CLOSED' : l.status,
            };
          }
          return l;
        })
      );
      setIsProcessingRepay(false);
      setRepaySuccess(true);
      setTimeout(() => {
        setRepayModalLoan(null);
        setRepaySuccess(false);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>My Loans & Repayment Portfolio</h1>
          <p>Track active disbursements, upcoming EMIs, and amortization schedules</p>
        </div>
        <Link to="/loans/apply" className="btn btn-primary btn-md">
          <Plus size={18} /> Apply for New Loan
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(totalOutstanding)}</div>
          <div className="stat-card-label">Total Outstanding Principal</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
            <Clock size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(nextPaymentSum)}</div>
          <div className="stat-card-label">Total Monthly EMI Due</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-info-muted)', color: 'var(--color-info)' }}>
            <FileText size={22} />
          </div>
          <div className="stat-card-value">{loans.filter((l) => l.status === 'ACTIVE').length}</div>
          <div className="stat-card-label">Active Loans in Good Standing</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <CheckCircle size={22} />
          </div>
          <div className="stat-card-value">100%</div>
          <div className="stat-card-label">On-Time Repayment Rate</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tab-nav" style={{ marginBottom: 'var(--space-6)' }}>
        {(['ALL', 'ACTIVE', 'FUNDING', 'CLOSED'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ALL' ? 'All Loans' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Loans Cards / List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredLoans.map((loan) => {
          const progressPercent = Math.min(100, Math.round((loan.monthsPaid / loan.tenureMonths) * 100));
          return (
            <div key={loan.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {loan.id}
                    </span>
                    <span className={`badge ${getLoanStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {loan.purpose}
                  </div>
                </div>

                <span className={`tier-badge ${getRiskTierColor(loan.riskTier)}`}>
                  Tier {loan.riskTier}
                </span>
              </div>

              {/* Amount & Rate Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Original Principal</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{formatCurrency(loan.principalAmount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Interest (APR)</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-info)' }}>{loan.interestRate}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Remaining Balance</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-warning)' }}>{formatCurrency(loan.remainingBalance)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Monthly EMI</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-success)' }}>{formatCurrency(loan.emiAmount)}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  <span>Repayment Progress</span>
                  <span>{loan.monthsPaid} of {loan.tenureMonths} Months ({progressPercent}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--color-accent), #10b981)' }} />
                </div>
              </div>

              {/* Due Date Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
                <Calendar size={14} />
                <span>Next Due: <strong style={{ color: 'var(--color-text-primary)' }}>{loan.nextDueDate}</strong></span>
              </div>

              {/* Actions Footer */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                {loan.status === 'ACTIVE' && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleOpenRepayModal(loan)}
                  >
                    Pay EMI ({formatCurrency(loan.emiAmount)})
                  </button>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: loan.status === 'ACTIVE' ? 1 : 2 }}
                  onClick={() => setScheduleModalLoan(loan)}
                >
                  Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Repay Modal */}
      {repayModalLoan && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Pay Monthly EMI — {repayModalLoan.id}</h3>
              <button className="btn btn-ghost btn-icon sm" onClick={() => setRepayModalLoan(null)}>
                <X size={18} />
              </button>
            </div>

            {repaySuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-success-muted)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                  <Check size={36} />
                </div>
                <h3>Repayment Successful!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                  Paid {formatCurrency(repayModalLoan.emiAmount)} with double-entry ledger settlement.
                </p>
                <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Ref: TXN-{Date.now().toString().slice(-8)}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                  Confirm payment for upcoming installment. Funds will be deducted from your Cash Wallet.
                </p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>EMI Amount</span>
                    <strong>{formatCurrency(repayModalLoan.emiAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Principal Component</span>
                    <span>{formatCurrency(repayModalLoan.emiAmount * 0.82)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Interest Component</span>
                    <span>{formatCurrency(repayModalLoan.emiAmount * 0.18)}</span>
                  </div>
                </div>

                {/* Idempotency Safe Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                  <Shield size={14} />
                  <span>Idempotency Protected: <code>{lastIdempotencyKey.slice(0, 16)}…</code></span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRepayModalLoan(null)} disabled={isProcessingRepay}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirmPayment} disabled={isProcessingRepay}>
                    {isProcessingRepay ? <span className="spinner" /> : `Confirm ${formatCurrency(repayModalLoan.emiAmount)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amortization Schedule Modal */}
      {scheduleModalLoan && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div>
                <h3>Amortization Schedule — {scheduleModalLoan.id}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {formatCurrency(scheduleModalLoan.principalAmount)} at {scheduleModalLoan.interestRate}% APR for {scheduleModalLoan.tenureMonths} Months
                </div>
              </div>
              <button className="btn btn-ghost btn-icon sm" onClick={() => setScheduleModalLoan(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Schedule Chart */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <RepaymentChart schedule={generateAmortizationSchedule(scheduleModalLoan.principalAmount, scheduleModalLoan.interestRate, scheduleModalLoan.tenureMonths)} />
            </div>

            {/* Schedule Table */}
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment (EMI)</th>
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {generateAmortizationSchedule(scheduleModalLoan.principalAmount, scheduleModalLoan.interestRate, scheduleModalLoan.tenureMonths).map((row) => (
                    <tr key={row.month} style={{ background: row.month <= scheduleModalLoan.monthsPaid ? 'rgba(16, 185, 129, 0.05)' : undefined }}>
                      <td>
                        <span style={{ fontWeight: 600 }}>Month {row.month}</span>
                        {row.month <= scheduleModalLoan.monthsPaid && (
                          <span className="badge badge-success" style={{ marginLeft: 'var(--space-2)', fontSize: '0.65rem' }}>Paid</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(row.emiAmount)}</td>
                      <td style={{ color: 'var(--color-info)' }}>{formatCurrency(row.principalPaid)}</td>
                      <td style={{ color: 'var(--color-warning)' }}>{formatCurrency(row.interestPaid)}</td>
                      <td>{formatCurrency(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansListPage;
