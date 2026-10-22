# Technical Architecture Specification: Digital Lending & Embedded Finance Platform

**Stack**: React.js (TypeScript) | Node.js (NestJS) | PostgreSQL | Redis | Apache Kafka

---

## 1. System Overview & Core Business Capabilities

This technical blueprint details a production-ready, cloud-native **Digital Lending and Embedded Finance Platform** built with **React.js** on the frontend and **Node.js (NestJS)** on the backend. 

The platform supports four core financial capabilities [5, 7]:
1. **Direct Digital Lending & Loan Origination**: Automated borrower onboarding, document collection, credit evaluation, and fund disbursement [5, 6].
2. **Peer-to-Peer (P2P) Marketplace**: Direct algorithmic matching between borrowers and institutional/individual lenders with risk-adjusted interest rates [7].
3. **Embedded Buy-Now-Pay-Later (BNPL)**: SDK and API gateway endpoints enabling e-commerce platforms to embed checkout financing and split-payment schedules at point-of-sale [5].
4. **AI-Powered Credit Assessment**: Alternative data ingestion (telecom logs, utility bill history, e-wallet transactions) evaluating credit risk for unbanked and underbanked borrowers [4].

---

## 2. Full-Stack Technology Architecture

| Layer | Component | Technology Selection | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework | **React.js (v18+) + TypeScript** | Strongly typed, component-driven UI for complex financial dashboards and application flows [1]. |
| | State Management | **Redux Toolkit / Zustand** | Immutable state handling for active loan schedules, user balances, and checkout flows. |
| | Data Viz & UI | **Recharts & Tailwind CSS** | Dynamic visual tracking of loan amortizations, interest breakdowns, and risk profiles [1]. |
| | Real-Time Updates | **WebSocket / Socket.io Client** | Instant push notifications for loan status changes, bid matching, and settlement events [2]. |
| **Backend** | Application Engine | **Node.js (NestJS Framework)** | Modular microservices architecture, built-in dependency injection, and native TypeScript support [3]. |
| | API Protocol | **GraphQL + REST API Gateway** | Field-precise client queries (GraphQL) for mobile/web dashboards, REST for external webhook partners [2]. |
| **Data Tier** | Relational DB | **PostgreSQL (v15+)** | Primary transaction store with serializable isolation for immutable double-entry ledger entries [2, 3]. |
| | In-Memory Cache | **Redis (v7+)** | Sub-millisecond rate limiting, session storage, and transaction idempotency validation [2, 3]. |
| | Time-Series Data | **TimescaleDB / MongoDB** | Append-only store for high-cardinality audit logs, telemetry, and behavioral analytics [2, 3]. |
| **Event Messaging** | Event Streaming | **Apache Kafka** | Distributed, replicated event log decoupling loan ingestion from asynchronous settlement processing [2, 3]. |
| | Service Queue | **RabbitMQ** | Asynchronous point-to-point task queues for email/SMS notifications and webhook processing [3]. |

---

## 3. High-Level System Architecture Diagram

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │            React.js Web App / Embedded SDK             │
                                  │   (Borrower Portal / Lender Dashboard / Checkout Widget) │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │ HTTPS / WSS
                                                              ▼
                                  ┌────────────────────────────────────────────────────────┐
                                  │                API Gateway (NestJS)                    │
                                  │    • JWT Authentication & RBAC                         │
                                  │    • Redis Rate-Limiting & Idempotency Key Check       │
                                  │    • Request Routing & GraphQL Query Aggregation       │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
         ┌──────────────────────────────┬─────────────────────┴──────────────┬──────────────────────────────┐
         ▼                              ▼                                    ▼                              ▼
┌──────────────────┐          ┌──────────────────┐                 ┌──────────────────┐           ┌──────────────────┐
│  Auth & Identity │          │ Loan Origination │                 │  Credit Scoring  │           │ Ledger & Payment │
│     Service      │          │     Service      │                 │     Engine       │           │     Service      │
│   (NestJS Micro) │          │   (NestJS Micro) │                 │  (Node / Python) │           │   (NestJS Micro) │
└────────┬─────────┘          └────────┬─────────┘                 └────────┬─────────┘           └────────┬─────────┘
         │                             │                                    │                               │
         ▼                             ▼                                    ▼                               ▼
┌──────────────────┐          ┌──────────────────┐                 ┌──────────────────┐           ┌──────────────────┐
│ Persona / Jumio  │          │ PostgreSQL DB    │                 │ XGBoost / SHAP   │           │ PostgreSQL ACID  │
│  (KYC/AML API)   │          │ (Loans & Terms)  │                 │ ML Risk Engine   │           │ Immutable Ledger │
└──────────────────┘          └────────┬─────────┘                 └──────────────────┘           └────────┬─────────┘
                                       │                                                                   │
                                       └──────────────────────────────┬────────────────────────────────────┘
                                                                      │ Publish Event
                                                                      ▼
                                                            ┌──────────────────┐
                                                            │   Apache Kafka   │
                                                            │  Distributed Log │
                                                            └────────┬─────────┘
                                                                     │ Consume Event
                                                                     ▼
                                                            ┌──────────────────┐
                                                            │ BaaS / Escrow    │
                                                            │ Payout Service   │
                                                            └──────────────────┘
```

---

## 4. Detailed Service Modules & Functional Workflows

### Module 1: Identity & Compliance (KYC / AML)
* **Workflow**: User registers via React frontend -> Node.js service verifies credentials -> External provider (e.g., Persona/Jumio) receives document uploads.
* **Compliance Checks**:
  * **KYC**: Automated facial recognition and government ID document parsing [6].
  * **AML**: Real-time screening against global PEP (Politically Exposed Persons) and sanctions watchlists [6].

### Module 2: AI-Powered Credit Scoring Engine
* **Workflow**: Ingests traditional data alongside alternative data sources (utility payments, telecom usage, digital wallet logs) [4].
* **Machine Learning Pipeline**:
  * Evaluates applicant features using ensemble models (**XGBoost / LightGBM**) [4].
  * Generates a calibrated default probability and assigns an interest rate tier [4].
  * Computes **SHAP (Shapley Additive Explanations)** values to provide human-readable, regulatory-compliant explanations for credit decisions [4].

### Module 3: Loan Origination & Matching Engine
* **Workflow**: Upon credit approval, loan terms (principal, tenure, APR) are finalized and published to the marketplace [7].
* **Algorithmic Matching**:
  * Matches loan requests against institutional lender risk parameters and individual investor bids [7].
  * Locks committed capital in an escrow ledger prior to contract execution [7].

### Module 4: Immutable Double-Entry Financial Ledger
* **Accounting Principle**: Every financial movement consists of two equal and opposite entries (Debit and Credit) to ensure financial balance [3].
* **Idempotent Settlement**: Transactions are tagged with a unique `Idempotency-Key` stored in Redis. Retried API requests safely return existing transaction receipts without double-disbursing funds [2, 6].

---

## 5. PostgreSQL Database Schema (ACID-Compliant)

```sql
-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('BORROWER', 'LENDER', 'ADMIN', 'MERCHANT')),
    kyc_status VARCHAR(20) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Loans Table
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES users(id),
    principal_amount DECIMAL(15, 2) NOT NULL CHECK (principal_amount > 0),
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL CHECK (tenure_months > 0),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'FUNDING', 'ACTIVE', 'CLOSED', 'DEFAULTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ledger Accounts
CREATE TABLE ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('CASH_WALLET', 'ESCROW', 'LOAN_PRINCIPAL', 'INTEREST_REVENUE')),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Double-Entry Journal Transactions
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    from_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    to_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('DISBURSEMENT', 'REPAYMENT_PRINCIPAL', 'REPAYMENT_INTEREST', 'FEE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Performance Optimization
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_ledger_user ON ledger_accounts(user_id);
CREATE INDEX idx_journal_ref ON journal_entries(transaction_ref);
```

---

## 6. Security, Infrastructure & Compliance

1. **Zero-Trust Security**: Mutual TLS (mTLS) for microservice-to-microservice traffic, paired with short-lived JWT tokens containing Role-Based Access Control (RBAC) [2].
2. **Audit Logging & Telemetry**: Continuous metric scraping via Prometheus and distributed transaction tracing via OpenTelemetry to ensure complete auditability [2].
3. **Data Sovereignty & Privacy**: Field-level encryption for Personally Identifiable Information (PII) to comply with GDPR, FCRA, and local financial regulations [2].

---
*Document generated for Gemini Notebook Fintech Architecture Guide.*
