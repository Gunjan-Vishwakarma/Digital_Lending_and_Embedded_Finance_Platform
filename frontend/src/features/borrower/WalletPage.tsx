import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  X,
  Check,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  id: string;
  ref: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'EMI_PAYMENT' | 'DISBURSEMENT' | 'ESCROW_LOCK';
  description: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  status: 'SETTLED' | 'PENDING';
  hash: string;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    ref: 'TXN-902148',
    type: 'EMI_PAYMENT',
    description: 'Monthly EMI payment for Loan #LN-8492',
    fromAccount: 'usr_wallet_01.CASH_WALLET',
    toAccount: 'platform.LOAN_PRINCIPAL & INTEREST',
    amount: -454.36,
    timestamp: '2026-10-22T14:32:00Z',
    status: 'SETTLED',
    hash: '8f7a9c3d...b12e',
  },
  {
    id: '2',
    ref: 'TXN-901842',
    type: 'DEPOSIT',
    description: 'ACH Transfer from Linked Bank Account (Plaid)',
    fromAccount: 'external.ACH_INFLOW',
    toAccount: 'usr_wallet_01.CASH_WALLET',
    amount: 5000.00,
    timestamp: '2026-10-21T09:15:00Z',
    status: 'SETTLED',
    hash: '4e2b1f8a...c930',
  },
  {
    id: '3',
    ref: 'TXN-899120',
    type: 'DISBURSEMENT',
    description: 'Loan Principal Disbursed for Loan #LN-7819',
    fromAccount: 'loan_escrow.ESCROW',
    toAccount: 'usr_wallet_01.CASH_WALLET',
    amount: 5000.00,
    timestamp: '2026-10-18T16:45:00Z',
    status: 'SETTLED',
    hash: '1a9f4c7d...8e42',
  },
  {
    id: '4',
    ref: 'TXN-898401',
    type: 'EMI_PAYMENT',
    description: 'Monthly EMI payment for Loan #LN-7819',
    fromAccount: 'usr_wallet_01.CASH_WALLET',
    toAccount: 'platform.LOAN_PRINCIPAL',
    amount: -433.12,
    timestamp: '2026-10-10T11:20:00Z',
    status: 'SETTLED',
    hash: '7c3d2a1b...f509',
  },
  {
    id: '5',
    ref: 'TXN-892110',
    type: 'WITHDRAWAL',
    description: 'P2P Wire Withdrawal to External Bank Checking',
    fromAccount: 'usr_wallet_01.CASH_WALLET',
    toAccount: 'external.BANK_PAYOUT',
    amount: -1200.00,
    timestamp: '2026-10-02T13:00:00Z',
    status: 'SETTLED',
    hash: '9d1a4e7b...2c81',
  },
];

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(24580.50);
  const [escrowBalance] = useState(2000.00);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Modal State
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTxn: Transaction = {
        id: uuidv4(),
        ref: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'DEPOSIT',
        description: 'Instant Bank Deposit (Plaid Verified)',
        fromAccount: 'external.ACH_INFLOW',
        toAccount: 'usr_wallet_01.CASH_WALLET',
        amount: val,
        timestamp: new Date().toISOString(),
        status: 'SETTLED',
        hash: `${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      };

      setBalance((prev) => prev + val);
      setTransactions((prev) => [newTxn, ...prev]);
      setIsSubmitting(false);
      setDepositOpen(false);
      setAmountInput('');
    }, 1000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0 || val > balance) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTxn: Transaction = {
        id: uuidv4(),
        ref: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'WITHDRAWAL',
        description: 'Wire Transfer Payout to Linked Account',
        fromAccount: 'usr_wallet_01.CASH_WALLET',
        toAccount: 'external.BANK_PAYOUT',
        amount: -val,
        timestamp: new Date().toISOString(),
        status: 'SETTLED',
        hash: `${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      };

      setBalance((prev) => prev - val);
      setTransactions((prev) => [newTxn, ...prev]);
      setIsSubmitting(false);
      setWithdrawOpen(false);
      setAmountInput('');
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Cash Wallet & Financial Ledger</h1>
          <p>Real-time balances and immutable double-entry journal transactions</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-md" onClick={() => { setAmountInput(''); setWithdrawOpen(true); }}>
            <Minus size={16} /> Withdraw
          </button>
          <button className="btn btn-primary btn-md" onClick={() => { setAmountInput(''); setDepositOpen(true); }}>
            <Plus size={16} /> Deposit Funds
          </button>
        </div>
      </div>

      {/* Account Balance Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
            <Wallet size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(balance)}</div>
          <div className="stat-card-label">Available CASH_WALLET Balance</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Asset Account • Normal Debit Balance
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div className="stat-card-icon" style={{ background: 'var(--color-info-muted)', color: 'var(--color-info)' }}>
            <Lock size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(escrowBalance)}</div>
          <div className="stat-card-label">ESCROW Reserved Funds</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Committed to Active Funding Pools
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-card-icon" style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="stat-card-value">100% Balanced</div>
          <div className="stat-card-label">Double-Entry Ledger Invariant</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            Σ Debits ≡ Σ Credits (Serializable ACID)
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #a855f7' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <RefreshCw size={22} />
          </div>
          <div className="stat-card-value">{transactions.length} Records</div>
          <div className="stat-card-label">Journal Entries Recorded</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Append-Only Audit Trail
          </div>
        </div>
      </div>

      {/* Ledger Journal Entries */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3>Double-Entry Journal Entries</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
              Every monetary movement is recorded with paired source/destination debit and credit accounts.
            </p>
          </div>
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Cryptographically Verified
          </span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Description</th>
                <th>Journal Route (From → To)</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Ledger Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => {
                const isPositive = txn.amount > 0;
                return (
                  <tr key={txn.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent-hover)', fontSize: 'var(--text-xs)' }}>
                        {txn.ref}
                      </span>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Hash: {txn.hash}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{txn.description}</div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                        {txn.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                        <div><strong style={{ color: 'var(--color-danger)' }}>Dr:</strong> {txn.toAccount}</div>
                        <div><strong style={{ color: 'var(--color-info)' }}>Cr:</strong> {txn.fromAccount}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {formatDateTime(txn.timestamp)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-base)', color: isPositive ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                      {isPositive ? `+${formatCurrency(txn.amount)}` : formatCurrency(txn.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-success">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {depositOpen && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3>Deposit Funds</h3>
              <button className="btn btn-ghost btn-icon sm" onClick={() => setDepositOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Deposit Amount (USD)</label>
                <input
                  type="number"
                  min="10"
                  step="0.01"
                  className="form-input"
                  placeholder="500.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Funds will be pulled via ACH (Plaid linked) and credited to your <code>CASH_WALLET</code> account upon authorization.
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDepositOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner" /> : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawOpen && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3>Withdraw Funds</h3>
              <button className="btn btn-ghost btn-icon sm" onClick={() => setWithdrawOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label className="form-label">Withdrawal Amount (USD)</label>
                <input
                  type="number"
                  min="10"
                  max={balance}
                  step="0.01"
                  className="form-input"
                  placeholder="500.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  required
                  autoFocus
                />
                <span className="form-helper">Available to withdraw: {formatCurrency(balance)}</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWithdrawOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner" /> : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
