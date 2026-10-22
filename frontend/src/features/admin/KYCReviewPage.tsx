import React, { useState } from 'react';
import { formatDateTime } from '../../utils/helpers';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  UserCheck,
  Search,
  Eye,
  Camera,
  ExternalLink,
} from 'lucide-react';

interface KYCVerification {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'BORROWER' | 'LENDER';
  docType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  docNumber: string;
  biometricScore: number; // e.g. 98.4%
  amlStatus: 'CLEAN' | 'FLAGGED_PEP' | 'MATCH_SANCTIONS';
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  notes?: string;
}

const initialKYCQueue: KYCVerification[] = [
  {
    id: 'KYC-501',
    userId: 'usr_b_109',
    name: 'Claire Tremblay',
    email: 'claire.t@example.com',
    role: 'BORROWER',
    docType: 'PASSPORT',
    docNumber: 'USA-99410291',
    biometricScore: 98.7,
    amlStatus: 'CLEAN',
    submittedAt: '2026-10-22T11:20:00Z',
    status: 'PENDING',
  },
  {
    id: 'KYC-502',
    userId: 'usr_l_204',
    name: 'Julianne Scott',
    email: 'j.scott@capitalholdings.com',
    role: 'LENDER',
    docType: 'DRIVERS_LICENSE',
    docNumber: 'CA-D1829471',
    biometricScore: 97.2,
    amlStatus: 'CLEAN',
    submittedAt: '2026-10-22T09:45:00Z',
    status: 'PENDING',
  },
  {
    id: 'KYC-498',
    userId: 'usr_b_088',
    name: 'Dmitri Voronin',
    email: 'dmitri.v@example.com',
    role: 'BORROWER',
    docType: 'NATIONAL_ID',
    docNumber: 'EE-38901239',
    biometricScore: 84.1,
    amlStatus: 'FLAGGED_PEP',
    submittedAt: '2026-10-21T17:10:00Z',
    status: 'PENDING',
    notes: 'Possible Politically Exposed Person (PEP) list partial name match in Estonia registry',
  },
  {
    id: 'KYC-490',
    userId: 'usr_b_065',
    name: 'Alex Vance',
    email: 'borrower@nexfin.io',
    role: 'BORROWER',
    docType: 'PASSPORT',
    docNumber: 'USA-77182940',
    biometricScore: 99.4,
    amlStatus: 'CLEAN',
    submittedAt: '2026-10-18T14:00:00Z',
    status: 'VERIFIED',
  },
];

const KYCReviewPage: React.FC = () => {
  const [queue, setQueue] = useState<KYCVerification[]>(initialKYCQueue);
  const [selectedId, setSelectedId] = useState<string>(initialKYCQueue[0].id);
  const [adminNote, setAdminNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeKYC = queue.find((k) => k.id === selectedId) || queue[0];

  const handleAction = (status: 'VERIFIED' | 'REJECTED') => {
    setQueue((prev) =>
      prev.map((k) =>
        k.id === activeKYC.id ? { ...k, status, notes: adminNote || k.notes } : k
      )
    );

    setToastMessage(
      status === 'VERIFIED'
        ? `KYC approved for ${activeKYC.name}. User status set to VERIFIED.`
        : `KYC rejected for ${activeKYC.name}. Re-upload email dispatched.`
    );
    setAdminNote('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>KYC / AML Identity & Compliance Verification</h1>
        <p>Review government IDs, facial biometric liveness, and global sanctions screening</p>
      </div>

      {toastMessage && (
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
          <CheckCircle size={18} /> {toastMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left: Queue List */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)' }}>Verification Queue</h3>
            <span className="badge badge-warning">
              {queue.filter((k) => k.status === 'PENDING').length} Pending
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {queue.map((item) => {
              const isSelected = item.id === activeKYC.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
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
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.id}</span>
                    <span className={`badge ${
                      item.status === 'VERIFIED' ? 'badge-success' :
                      item.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    {item.email} • {item.role}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                    <span>Biometric: <strong style={{ color: item.biometricScore > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>{item.biometricScore}%</strong></span>
                    <span style={{ color: item.amlStatus === 'CLEAN' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                      AML: {item.amlStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verification Inspector */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <h2>{activeKYC.name}</h2>
                <span className="badge badge-info">{activeKYC.role}</span>
                <span className={`badge ${
                  activeKYC.status === 'VERIFIED' ? 'badge-success' :
                  activeKYC.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {activeKYC.status}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                User ID: <code>{activeKYC.userId}</code> • Submitted: {formatDateTime(activeKYC.submittedAt)}
              </div>
            </div>

            {/* Action Buttons */}
            {activeKYC.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleAction('REJECTED')}
                >
                  <XCircle size={14} /> Reject / Request Re-upload
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAction('VERIFIED')}
                >
                  <CheckCircle size={14} /> Approve Identity (Verify)
                </button>
              </div>
            )}
          </div>

          {/* Verification Checks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {/* Document Check */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <FileText size={18} color="var(--color-accent-hover)" />
                <h4 style={{ fontSize: 'var(--text-sm)' }}>Document Authenticity</h4>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Type: <strong>{activeKYC.docType}</strong></div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Number: <strong>{activeKYC.docNumber}</strong></div>
              <div style={{ marginTop: 'var(--space-2)', color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                ✓ Tamper Detection: PASSED
              </div>
            </div>

            {/* Facial Biometrics */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <Camera size={18} color="var(--color-info)" />
                <h4 style={{ fontSize: 'var(--text-sm)' }}>Facial Biometrics & Liveness</h4>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: activeKYC.biometricScore > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {activeKYC.biometricScore}%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                3D Depth Liveness: Real Human Confirmed
              </div>
            </div>

            {/* AML Watchlist */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                {activeKYC.amlStatus === 'CLEAN' ? (
                  <ShieldCheck size={18} color="var(--color-success)" />
                ) : (
                  <ShieldAlert size={18} color="var(--color-danger)" />
                )}
                <h4 style={{ fontSize: 'var(--text-sm)' }}>AML & Sanctions Screening</h4>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: activeKYC.amlStatus === 'CLEAN' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {activeKYC.amlStatus}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Screened against OFAC, PEP, and Interpol
              </div>
            </div>
          </div>

          {/* Document Preview Mockup */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Document Proof Preview (Persona OCR)</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  height: 160,
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  gap: 'var(--space-2)',
                }}
              >
                <FileText size={32} />
                <span>{activeKYC.docType} Front Image (Encrypted AES-256)</span>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Checksum Verified</span>
              </div>

              <div
                style={{
                  height: 160,
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  gap: 'var(--space-2)',
                }}
              >
                <Camera size={32} />
                <span>Biometric Selfie & Liveness Video Frame</span>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Face Match: {activeKYC.biometricScore}%</span>
              </div>
            </div>
          </div>

          {/* Admin Override Note */}
          <div className="form-group">
            <label className="form-label">Compliance Audit Reason / Override Note</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Manually verified passport against notarized copy; cleared false-positive PEP flag."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCReviewPage;
