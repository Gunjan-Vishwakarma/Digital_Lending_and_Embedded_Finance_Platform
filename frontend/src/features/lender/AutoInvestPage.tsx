import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
  Target,
  Zap,
  CheckCircle,
  Shield,
  Save,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AutoBidRule {
  enabled: boolean;
  maxPerLoan: number;
  totalBudget: number;
  allocatedSoFar: number;
  minYield: number;
  minCreditScore: number;
  selectedTiers: string[];
  selectedTenures: number[];
}

interface AutoBidLog {
  id: string;
  loanId: string;
  amount: number;
  tier: string;
  yield: number;
  timestamp: string;
  matchReason: string;
}

const initialLogs: AutoBidLog[] = [
  {
    id: 'LOG-309',
    loanId: 'LN-9450',
    amount: 1000,
    tier: 'A',
    yield: 6.8,
    timestamp: '2026-10-22T08:14:00Z',
    matchReason: 'Matched Tier A rule & Min Score 785 >= 700',
  },
  {
    id: 'LOG-304',
    loanId: 'LN-9201',
    amount: 1000,
    tier: 'B',
    yield: 9.8,
    timestamp: '2026-10-21T16:42:00Z',
    matchReason: 'Matched Tier B rule & Yield 9.8% >= 7.0%',
  },
  {
    id: 'LOG-298',
    loanId: 'LN-8492',
    amount: 1000,
    tier: 'B',
    yield: 8.5,
    timestamp: '2026-10-19T11:20:00Z',
    matchReason: 'Matched Tier B rule & 24 mo tenure',
  },
];

const AutoInvestPage: React.FC = () => {
  const [rule, setRule] = useState<AutoBidRule>({
    enabled: true,
    maxPerLoan: 1000,
    totalBudget: 20000,
    allocatedSoFar: 3000,
    minYield: 7.0,
    minCreditScore: 700,
    selectedTiers: ['A', 'B'],
    selectedTenures: [12, 24, 36],
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleTier = (tier: string) => {
    setRule((prev) => ({
      ...prev,
      selectedTiers: prev.selectedTiers.includes(tier)
        ? prev.selectedTiers.filter((t) => t !== tier)
        : [...prev.selectedTiers, tier],
    }));
  };

  const toggleTenure = (tenure: number) => {
    setRule((prev) => ({
      ...prev,
      selectedTenures: prev.selectedTenures.includes(tenure)
        ? prev.selectedTenures.filter((t) => t !== tenure)
        : [...prev.selectedTenures, tenure],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const remainingBudget = Math.max(0, rule.totalBudget - rule.allocatedSoFar);
  const budgetUtilization = Math.round((rule.allocatedSoFar / rule.totalBudget) * 100);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Auto-Invest & Algorithmic Bidding</h1>
          <p>Automate capital deployment using event-driven Kafka stream consumers</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Status:</span>
          <button
            type="button"
            className={`btn btn-sm ${rule.enabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRule((prev) => ({ ...prev, enabled: !prev.enabled }))}
            style={{ minWidth: 100 }}
          >
            {rule.enabled ? '● Active' : '○ Paused'}
          </button>
        </div>
      </div>

      {/* Budget Summary Grid */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
            <Target size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(rule.totalBudget)}</div>
          <div className="stat-card-label">Total Allocated Auto-Bid Budget</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
            <Zap size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(rule.allocatedSoFar)}</div>
          <div className="stat-card-label">Auto-Deployed So Far ({budgetUtilization}%)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-info-muted)', color: 'var(--color-info)' }}>
            <Clock size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(remainingBudget)}</div>
          <div className="stat-card-label">Remaining Uncommitted Capacity</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
            <Sparkles size={22} />
          </div>
          <div className="stat-card-value">{formatCurrency(rule.maxPerLoan)}</div>
          <div className="stat-card-label">Max Commitment Per Loan</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Rules Config Form */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <div>
              <h3>Algorithm Parameters & Filters</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
                Loans matching all selected criteria will be auto-funded instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Total Strategy Budget (USD)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  className="form-input"
                  value={rule.totalBudget}
                  onChange={(e) => setRule({ ...rule, totalBudget: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max per Loan Ticket (USD)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  className="form-input"
                  value={rule.maxPerLoan}
                  onChange={(e) => setRule({ ...rule, maxPerLoan: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div className="form-group">
                <label className="form-label">Minimum Gross APR Yield ({rule.minYield}%)</label>
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.5"
                  value={rule.minYield}
                  onChange={(e) => setRule({ ...rule, minYield: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Borrower Credit Score ({rule.minCreditScore})</label>
                <input
                  type="range"
                  min="600"
                  max="800"
                  step="10"
                  value={rule.minCreditScore}
                  onChange={(e) => setRule({ ...rule, minCreditScore: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                />
              </div>
            </div>

            {/* Risk Tier Multi-Select */}
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label">Eligible Risk Tiers</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {['A', 'B', 'C', 'D'].map((tier) => {
                  const active = rule.selectedTiers.includes(tier);
                  return (
                    <button
                      key={tier}
                      type="button"
                      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => toggleTier(tier)}
                    >
                      Tier {tier} {active ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tenure Options */}
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label">Allowed Tenures</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {[6, 12, 24, 36, 48].map((tenure) => {
                  const active = rule.selectedTenures.includes(tenure);
                  return (
                    <button
                      key={tenure}
                      type="button"
                      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => toggleTenure(tenure)}
                    >
                      {tenure} Mo {active ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {savedSuccess ? (
                <span style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Auto-bid rules active on Kafka stream!
                </span>
              ) : <div />}
              <button type="submit" className="btn btn-primary btn-md">
                <Save size={16} /> Save Strategy Rules
              </button>
            </div>
          </form>
        </div>

        {/* Kafka Architecture Info & Live Event Consumer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Zap size={20} color="var(--color-accent-hover)" />
            <h3>Kafka Stream Processing</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Your auto-bid engine runs as an event consumer listening to the <code>loan.events</code> Apache Kafka topic.
          </p>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
            <div style={{ color: 'var(--color-info)' }}>// Kafka Consumer: auto-bid-group</div>
            <div style={{ color: 'var(--color-text-muted)' }}>topic: "loan.events"</div>
            <div>event: "LOAN_CREATED" → filter(rules)</div>
            <div>&nbsp;&nbsp;↳ status: 200 OK</div>
            <div>&nbsp;&nbsp;↳ dispatch: "COMMIT_ESCROW"</div>
            <div style={{ color: 'var(--color-success)' }}>&nbsp;&nbsp;↳ journal: DEBIT wallet / CREDIT escrow</div>
          </div>

          <div style={{ marginTop: 'auto', padding: 'var(--space-3)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Zero slippage: Redis distributed locking guarantees you never exceed your allocated budget limit.
          </div>
        </div>
      </div>

      {/* Auto-Bid Execution History */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3>Recent Automated Commitments</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
              Audit log of automated loan allocations triggered by the auto-invest algorithm
            </p>
          </div>
          <span className="badge badge-success">3 Executions</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Target Loan</th>
                <th>Risk Tier</th>
                <th>Yield APR</th>
                <th style={{ textAlign: 'right' }}>Amount Committed</th>
                <th>Algorithmic Match Reason</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {initialLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent-hover)' }}>
                    {log.id}
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.loanId}</td>
                  <td>
                    <span className="badge badge-info">Tier {log.tier}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>{log.yield}%</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(log.amount)}</td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{log.matchReason}</td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutoInvestPage;
