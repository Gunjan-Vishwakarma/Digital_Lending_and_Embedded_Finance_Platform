# Node.js / NestJS Backend Architecture Specification
## Digital Lending & Embedded Finance Platform

---

## 1. Executive Summary & Tech Stack

This specification defines the enterprise microservices backend architecture for the **Digital Lending & Embedded Finance Platform**. Built with **Node.js (NestJS framework)** in TypeScript, the backend handles high-concurrency transaction processing, automated credit risk evaluation, double-entry financial ledger operations, and Banking-as-a-Service (BaaS) integrations.

### Technology Stack Overview
* **Framework**: Node.js v20+ with **NestJS** (Modular architecture, dependency injection, native OpenAPI/Swagger support)
* **Primary Database**: **PostgreSQL 16** (ACID-compliant relational ledger and transaction storage)
* **ORM & Database Tooling**: Prisma ORM / TypeORM (Migrations, serializable transaction locks, raw SQL execution)
* **In-Memory Store**: **Redis** (Session caching, distributed locks, API rate limiting, idempotency store)
* **Message Broker**: **Apache Kafka** / **RabbitMQ** (Asynchronous event-driven event stream processing)
* **Machine Learning Interface**: Python Microservice / ONNX Runtime sidecar (XGBoost / SHAP credit model execution)
* **Integrations**: BaaS APIs (Stripe Treasury / Unit), Persona / Jumio (KYC/AML webhooks), Plaid API (Bank account telemetry)

---

## 2. Microservices Architecture & Component Map

```
                                 ┌─────────────────────────────────┐
                                 │       Client Application        │
                                 │    (React.js / SDK / Mobile)    │
                                 └────────────────┬────────────────┘
                                                  │ HTTPS / REST / WSS
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │       API Gateway (NestJS)      │
                                 │ • OAuth2 / JWT Authentication   │
                                 │ • Rate Limiting & TLS Guard     │
                                 │ • Idempotency Interceptor       │
                                 └────────────────┬────────────────┘
                                                  │
         ┌───────────────────────┬────────────────┴───────────────────────┬───────────────────────┐
         ▼                       ▼                                        ▼                       ▼
┌───────────────────┐  ┌───────────────────┐                    ┌───────────────────┐   ┌───────────────────┐
│ Auth & User       │  │ Loan Origination  │                    │ Credit Risk       │   │ Double-Entry      │
│ Service           │  │ Service           │                    │ Scoring Engine    │   │ Ledger Service    │
│ (NestJS)          │  │ (NestJS)          │                    │ (Node/Python)     │   │ (NestJS)          │
└─────────┬─────────┘  └─────────┬─────────┘                    └─────────┬─────────┘   └─────────┬─────────┘
          │                      │                                        │                       │
          ▼                      ▼                                        ▼                       ▼
┌───────────────────┐  ┌───────────────────┐                    ┌───────────────────┐   ┌───────────────────┐
│ User Auth DB      │  │ Loan State DB     │                    │ XGBoost / SHAP    │   │ PostgreSQL ACID   │
│ (PostgreSQL)      │  │ (PostgreSQL)      │                    │ ML Model Runner   │   │ Ledger DB         │
└───────────────────┘  └─────────┬─────────┘                    └───────────────────┘   └─────────┬─────────┘
                                 │                                                                │
                                 └────────────────────────┬───────────────────────────────────────┘
                                                          │ Publish Events
                                                          ▼
                                                ┌───────────────────┐
                                                │ Apache Kafka      │
                                                │ Event Bus         │
                                                └─────────┬─────────┘
                                                          │ Consume Events
                                                          ▼
                                                ┌───────────────────┐
                                                │ BaaS / Escrow     │
                                                │ Payout Service    │
                                                └───────────────────┘
```

---

## 3. Database Schema (PostgreSQL DDL)

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('BORROWER', 'LENDER', 'ADMIN');
CREATE TYPE kyc_state AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE loan_status AS ENUM ('DRAFT', 'UNDERWRITING', 'FUNDING', 'ACTIVE', 'CLOSED', 'DEFAULTED');
CREATE TYPE ledger_account_type AS ENUM ('CASH_WALLET', 'ESCROW', 'LOAN_PRINCIPAL', 'INTEREST_REVENUE');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'BORROWER',
    kyc_status kyc_state NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans Table
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    principal_amount NUMERIC(15, 2) NOT NULL CHECK (principal_amount > 0),
    interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0),
    tenure_months INT NOT NULL CHECK (tenure_months > 0),
    status loan_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ledger Accounts (Immutability & Double-Entry Support)
CREATE TABLE ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    account_type ledger_account_type NOT NULL,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entries (Double-Entry Bookkeeping Ledger)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    from_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    to_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Idempotency Lock Table
CREATE TABLE idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    response_body JSONB NOT NULL,
    status_code INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Sample NestJS Service Implementations

### 4.1 Double-Entry Ledger Service with Serializable Locking (`ledger.service.ts`)

```typescript
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LedgerService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Executes an atomic double-entry journal transfer with serializable isolation.
   */
  async transferFunds(
    transactionRef: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ): Promise<{ journalEntryId: string }> {
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1. Check & debit sender account with row-level lock
      const fromAccount = await queryRunner.manager.query(
        `SELECT id, balance FROM ledger_accounts WHERE id = $1 FOR UPDATE`,
        [fromAccountId]
      );

      if (!fromAccount || fromAccount.length === 0) {
        throw new BadRequestException('Source ledger account not found');
      }

      if (Number(fromAccount[0].balance) < amount) {
        throw new BadRequestException('Insufficient funds in source ledger account');
      }

      // 2. Debit source account
      await queryRunner.manager.query(
        `UPDATE ledger_accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, fromAccountId]
      );

      // 3. Credit destination account
      await queryRunner.manager.query(
        `UPDATE ledger_accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, toAccountId]
      );

      // 4. Create immutable journal entry record
      const res = await queryRunner.manager.query(
        `INSERT INTO journal_entries (transaction_ref, from_account_id, to_account_id, amount, description)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [transactionRef, fromAccountId, toAccountId, amount, description]
      );

      await queryRunner.commitTransaction();
      return { journalEntryId: res[0].id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err instanceof BadRequestException
        ? err
        : new InternalServerErrorException('Ledger transaction failed');
    } finally {
      await queryRunner.release();
    }
  }
}
```

### 4.2 Idempotency Interceptor (`idempotency.interceptor.ts`)

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from './redis.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      return next.handle(); // Proceed if header is absent
    }

    const redisKey = `idempotency:${idempotencyKey}`;
    const cachedResponse = await this.redisService.get(redisKey);

    if (cachedResponse) {
      const parsed = JSON.parse(cachedResponse);
      const response = context.switchToHttp().getResponse();
      response.status(parsed.statusCode);
      return of(parsed.body); // Return cached response immediately
    }

    const lockAcquired = await this.redisService.setNx(redisKey + ':lock', 'LOCKED', 10);
    if (!lockAcquired) {
      throw new ConflictException('Concurrent request with identical idempotency key in progress');
    }

    return next.handle().pipe(
      tap(async (data) => {
        const response = context.switchToHttp().getResponse();
        await this.redisService.set(
          redisKey,
          JSON.stringify({ statusCode: response.statusCode, body: data }),
          86400 // Cache for 24 hours
        );
        await this.redisService.del(redisKey + ':lock');
      })
    );
  }
}
```

---

## 5. Security & Compliance Standards

1. **Mutual TLS (mTLS)**: Enforced between service-to-service communication within the Kubernetes container network.
2. **Double-Entry Ledger Integrity**: Every balance alteration requires paired debit/credit movements ensuring the zero-sum ledger balance rule: $\sum \text{Debits} = \sum \text{Credits}$.
3. **Audit Trail Immutability**: Journal entries cannot be updated or deleted. Reversals require posting compensating entries.
