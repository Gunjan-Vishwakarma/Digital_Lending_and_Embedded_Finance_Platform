-- =============================================================================
-- DIGITAL LENDING & EMBEDDED FINANCE PLATFORM
-- Sample Seed Data for Beekeeper Studio
-- =============================================================================

-- 1. Insert Users
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, kyc_status, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'alex.vance@example.com', '$2b$12$e8Jk...', 'Alex', 'Vance', 'BORROWER', 'VERIFIED', '+1-555-0192'),
  ('22222222-2222-2222-2222-222222222222', 'marcus.bennett@example.com', '$2b$12$e8Jk...', 'Marcus', 'Bennett', 'BORROWER', 'VERIFIED', '+1-555-0193'),
  ('33333333-3333-3333-3333-333333333333', 'elena.rostova@apexcap.com', '$2b$12$e8Jk...', 'Elena', 'Rostova', 'LENDER', 'VERIFIED', '+1-555-0194'),
  ('44444444-4444-4444-4444-444444444444', 'admin@nexfin.internal', '$2b$12$e8Jk...', 'Sarah', 'Jenkins', 'ADMIN', 'VERIFIED', '+1-555-0190')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert KYC Records
INSERT INTO kyc_verifications (user_id, doc_type, doc_number, biometric_score, aml_status, status, reviewer_notes)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'PASSPORT', 'US-P-8839210', 98.40, 'CLEAN', 'VERIFIED', 'Biometric liveness confirmed.'),
  ('22222222-2222-2222-2222-222222222222', 'DRIVERS_LICENSE', 'DL-CA-992144', 94.20, 'CLEAN', 'VERIFIED', 'Address and document matched.');

-- 3. Insert Loans
INSERT INTO loans (id, loan_reference, borrower_id, principal_amount, interest_rate, tenure_months, purpose, monthly_income, employment_status, credit_score, risk_tier, default_probability, funded_amount, months_paid, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'LN-8492', '11111111-1111-1111-1111-111111111111', 10000.00, 8.50, 24, 'Debt Consolidation', 4500.00, 'Full-Time Tech', 742, 'B', 0.0420, 10000.00, 6, 'ACTIVE'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'LN-7819', '11111111-1111-1111-1111-111111111111', 5000.00, 7.20, 12, 'Home Improvement', 4500.00, 'Full-Time Tech', 780, 'A', 0.0210, 5000.00, 4, 'ACTIVE'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'LN-9201', '22222222-2222-2222-2222-222222222222', 15000.00, 9.80, 24, 'Small Business Equipment', 6200.00, 'Founder, Logistics', 718, 'B', 0.0580, 11250.00, 0, 'FUNDING');

-- 4. Insert Ledger Accounts
INSERT INTO ledger_accounts (id, user_id, account_number, account_type, balance, currency)
VALUES
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'WAL-BORROWER-ALEX', 'CASH_WALLET', 2450.00, 'USD'),
  ('20000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'WAL-LENDER-ELENA', 'CASH_WALLET', 48200.00, 'USD'),
  ('30000000-0000-0000-0000-000000000003', NULL, 'SYS-ESCROW-POOL', 'ESCROW', 11250.00, 'USD'),
  ('40000000-0000-0000-0000-000000000004', NULL, 'SYS-REVENUE-FEE', 'PLATFORM_FEE', 1420.50, 'USD');

-- 5. Insert Sample Journal Transactions (Double-Entry Pairs)
INSERT INTO journal_entries (transaction_ref, from_account_id, to_account_id, amount, entry_type, cryptographic_hash)
VALUES
  ('TXN-8819201', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 5000.00, 'ESCROW_LOCK', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
  ('TXN-8819202', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 454.56, 'REPAYMENT_PRINCIPAL', 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb');

-- 6. Insert Merchant & BNPL
INSERT INTO merchants (id, name, api_key_hash, webhook_url, discount_rate)
VALUES
  ('99999999-9999-9999-9999-999999999999', 'Nordic Audio & Tech', '$2b$12$merchantHash99...', 'https://nordicaudio.com/api/webhooks/nexfin', 2.90);

INSERT INTO bnpl_orders (merchant_id, user_id, order_ref, total_amount, installment_plan, status)
VALUES
  ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'ORD-BNPL-7712', 1200.00, 'PAY_IN_4', 'ACTIVE');
