import React, { useState } from 'react';
import { formatDateTime } from '../../utils/helpers';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle,
  Lock,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  eventType: string;
  actorEmail: string;
  actorRole: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  sha256Hash: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-99124',
    eventType: 'UNDERWRITING_APPROVED',
    actorEmail: 'admin@nexfin.io',
    actorRole: 'ADMIN',
    entityType: 'LOAN',
    entityId: 'LN-9201',
    details: 'Loan approved for $15,000 at 9.8% APR (Tier B). Promoted to Marketplace.',
    ipAddress: '192.168.1.42',
    timestamp: '2026-10-22T14:10:00Z',
    sha256Hash: 'a4f912e8c071...9b12',
  },
  {
    id: 'AUD-99120',
    eventType: 'ESCROW_LOCKED',
    actorEmail: 'lender@nexfin.io',
    actorRole: 'LENDER',
    entityType: 'INVESTMENT',
    entityId: 'INV-110',
    details: 'Committed $5,000 to Loan #LN-9450. Dr: ESCROW / Cr: CASH_WALLET.',
    ipAddress: '72.14.201.88',
    timestamp: '2026-10-22T12:05:00Z',
    sha256Hash: 'd7e1082ab304...f481',
  },
  {
    id: 'AUD-99115',
    eventType: 'EMI_PAID',
    actorEmail: 'borrower@nexfin.io',
    actorRole: 'BORROWER',
    entityType: 'REPAYMENT',
    entityId: 'RPY-8492-06',
    details: 'EMI installment paid: $454.36 ($383.53 principal, $70.83 interest).',
    ipAddress: '98.120.44.12',
    timestamp: '2026-10-22T10:15:00Z',
    sha256Hash: '5c8290f14d12...3e90',
  },
  {
    id: 'AUD-99104',
    eventType: 'KYC_VERIFIED',
    actorEmail: 'system.persona_webhook',
    actorRole: 'SYSTEM',
    entityType: 'USER',
    entityId: 'usr_b_065',
    details: 'Persona webhook inquiry inq_77412 approved. Biometric score: 99.4%.',
    ipAddress: '34.205.12.99',
    timestamp: '2026-10-22T08:22:00Z',
    sha256Hash: 'b12e847c19a0...8f2a',
  },
  {
    id: 'AUD-99092',
    eventType: 'LOAN_CREATED',
    actorEmail: 'marcus.b@example.com',
    actorRole: 'BORROWER',
    entityType: 'LOAN',
    entityId: 'LN-9201',
    details: 'Submitted 4-step loan application for $15,000 (24 months). Zod verified.',
    ipAddress: '172.56.21.90',
    timestamp: '2026-10-22T08:30:00Z',
    sha256Hash: 'e391b42a00c8...1a74',
  },
  {
    id: 'AUD-99081',
    eventType: 'USER_REGISTERED',
    actorEmail: 'marcus.b@example.com',
    actorRole: 'BORROWER',
    entityType: 'USER',
    entityId: 'usr_b_112',
    details: 'Account created with CASH_WALLET initial ledger entry initialized ($0.00).',
    ipAddress: '172.56.21.90',
    timestamp: '2026-10-22T08:15:00Z',
    sha256Hash: '8a12c490ef17...6b33',
  },
];

const AuditTrailPage: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (selectedEvent !== 'ALL' && log.eventType !== selectedEvent) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = 'ID,Event Type,Actor,Role,Entity,Entity ID,Details,IP,Timestamp,SHA256 Hash\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.eventType}","${l.actorEmail}","${l.actorRole}","${l.entityType}","${l.entityId}","${l.details}","${l.ipAddress}","${l.timestamp}","${l.sha256Hash}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexfin_audit_trail_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Immutable Compliance & Audit Trail</h1>
          <p>Cryptographically hashed append-only log of every financial and administrative action</p>
        </div>
        <button className="btn btn-secondary btn-md" onClick={exportCSV}>
          <Download size={16} /> Export Audit Log (CSV)
        </button>
      </div>

      {/* Filter Strip */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by User, Loan ID, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {['ALL', 'UNDERWRITING_APPROVED', 'ESCROW_LOCKED', 'EMI_PAID', 'KYC_VERIFIED', 'LOAN_CREATED'].map((ev) => (
              <button
                key={ev}
                type="button"
                className={`btn btn-sm ${selectedEvent === ev ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedEvent(ev)}
              >
                {ev === 'ALL' ? 'All Events' : ev.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Lock size={18} color="var(--color-success)" />
            <h3>Append-Only System Log ({filteredLogs.length} Records)</h3>
          </div>
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> SHA-256 Merkle Chained
          </span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Action Type</th>
                <th>Actor & Role</th>
                <th>Entity Affected</th>
                <th>Action Summary & Details</th>
                <th>Timestamp</th>
                <th>Tamper Seal</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    {log.id}
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {log.eventType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{log.actorEmail}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                      Role: {log.actorRole} • IP: {log.ipAddress}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-hover)' }}>
                      {log.entityId}
                    </span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                      {log.entityType}
                    </div>
                  </td>
                  <td style={{ maxWidth: 320, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {log.details}
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-success)',
                      }}
                      title="SHA-256 Cryptographic Checksum"
                    >
                      {log.sha256Hash}
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

export default AuditTrailPage;
