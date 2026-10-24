-- =============================================================================
-- DIGITAL LENDING & EMBEDDED FINANCE PLATFORM
-- PostgreSQL Database Initialization & DDL Schema
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if re-initializing (in dependency order)
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS ledger_accounts CASCADE;
DROP TABLE IF EXISTS loan_investments CASCADE;
DROP TABLE IF EXISTS amortization_schedule CASCADE;
DROP TABLE IF EXISTS bnpl_orders CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS kyc_verifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('BORROWER', 'LENDER', 'ADMIN', 'MERCHANT')),
    kyc_status VARCHAR(20) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. KYC VERIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID')),
    doc_number VARCHAR(100) NOT NULL,
    biometric_score DECIMAL(5, 2) NOT NULL CHECK (biometric_score >= 0 AND biometric_score <= 100),
    aml_status VARCHAR(30) DEFAULT 'CLEAN' CHECK (aml_status IN ('CLEAN', 'FLAGGED_PEP', 'MATCH_SANCTIONS')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    reviewer_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- -----------------------------------------------------------------------------
-- 3. LOANS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_reference VARCHAR(50) UNIQUE NOT NULL,
    borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    principal_amount DECIMAL(15, 2) NOT NULL CHECK (principal_amount > 0),
    interest_rate DECIMAL(5, 2) NOT NULL CHECK (interest_rate >= 0),
    tenure_months INT NOT NULL CHECK (tenure_months > 0),
    purpose VARCHAR(255) NOT NULL,
    monthly_income DECIMAL(15, 2) NOT NULL,
    employment_status VARCHAR(100) NOT NULL,
    credit_score INT NOT NULL CHECK (credit_score BETWEEN 300 AND 850),
    risk_tier VARCHAR(5) NOT NULL CHECK (risk_tier IN ('A', 'B', 'C', 'D')),
    default_probability DECIMAL(5, 4) NOT NULL,
    funded_amount DECIMAL(15, 2) DEFAULT 0.00 CHECK (funded_amount <= principal_amount),
    months_paid INT DEFAULT 0 CHECK (months_paid >= 0),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'UNDERWRITING', 'APPROVED', 'FUNDING', 'ACTIVE', 'CLOSED', 'DEFAULTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. LOAN INVESTMENTS (Marketplace Fractional Co-Funding)
-- -----------------------------------------------------------------------------
CREATE TABLE loan_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE RESTRICT,
    lender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    ownership_percentage DECIMAL(7, 4) NOT NULL CHECK (ownership_percentage > 0 AND ownership_percentage <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. AMORTIZATION SCHEDULE TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE amortization_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    month_number INT NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    principal_component DECIMAL(15, 2) NOT NULL,
    interest_component DECIMAL(15, 2) NOT NULL,
    remaining_balance DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'OVERDUE')),
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- -----------------------------------------------------------------------------
-- 6. DOUBLE-ENTRY LEDGER ACCOUNTS
-- -----------------------------------------------------------------------------
CREATE TABLE ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('CASH_WALLET', 'ESCROW', 'LOAN_PRINCIPAL', 'INTEREST_REVENUE', 'PLATFORM_FEE')),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. DOUBLE-ENTRY JOURNAL ENTRIES
-- -----------------------------------------------------------------------------
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    from_account_id UUID NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
    to_account_id UUID NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('DISBURSEMENT', 'REPAYMENT_PRINCIPAL', 'REPAYMENT_INTEREST', 'ESCROW_LOCK', 'FEE', 'DEPOSIT', 'WITHDRAWAL')),
    cryptographic_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. MERCHANTS (Embedded Finance Partners)
-- -----------------------------------------------------------------------------
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    api_key_hash VARCHAR(255) UNIQUE NOT NULL,
    webhook_url VARCHAR(500),
    discount_rate DECIMAL(5, 2) DEFAULT 2.90,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. BNPL ORDERS (Point of Sale Split-Pay Transactions)
-- -----------------------------------------------------------------------------
CREATE TABLE bnpl_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_ref VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount > 0),
    installment_plan VARCHAR(20) NOT NULL CHECK (installment_plan IN ('PAY_IN_4', 'MONTHLY_6')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DEFAULTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. AUDIT LOGS (Tamper-Evident Security Log)
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    sha256_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_ledger_user ON ledger_accounts(user_id);
CREATE INDEX idx_journal_from_to ON journal_entries(from_account_id, to_account_id);
CREATE INDEX idx_journal_ref ON journal_entries(transaction_ref);
CREATE INDEX idx_investments_loan ON loan_investments(loan_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
