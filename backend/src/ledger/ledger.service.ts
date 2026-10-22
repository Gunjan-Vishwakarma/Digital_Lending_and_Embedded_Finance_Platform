import { Injectable, BadRequestException } from '@nestjs/common';

export interface LedgerAccount {
  id: string;
  userId: string;
  accountType: 'CASH_WALLET' | 'ESCROW' | 'LOAN_PRINCIPAL' | 'INTEREST_REVENUE';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  transactionRef: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  createdAt: string;
}

@Injectable()
export class LedgerService {
  private accounts: LedgerAccount[] = [
    {
      id: 'acc_wallet_01',
      userId: 'usr_borrower_01',
      accountType: 'CASH_WALLET',
      balance: 24580.50,
      currency: 'USD',
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'acc_escrow_01',
      userId: 'platform',
      accountType: 'ESCROW',
      balance: 2000.00,
      currency: 'USD',
      createdAt: '2026-01-15T10:00:00Z',
    },
  ];

  private journal: JournalEntry[] = [
    {
      id: 'jnl_1',
      transactionRef: 'TXN-902148',
      fromAccountId: 'acc_wallet_01',
      toAccountId: 'platform.LOAN_PRINCIPAL',
      amount: 454.36,
      description: 'Monthly EMI payment for Loan #LN-8492',
      createdAt: '2026-10-22T14:32:00Z',
    },
    {
      id: 'jnl_2',
      transactionRef: 'TXN-901842',
      fromAccountId: 'external.ACH_INFLOW',
      toAccountId: 'acc_wallet_01',
      amount: 5000.00,
      description: 'ACH Transfer from Linked Bank Account (Plaid)',
      createdAt: '2026-10-21T09:15:00Z',
    },
  ];

  async getAccounts() {
    return { success: true, data: this.accounts };
  }

  async getBalance() {
    return {
      success: true,
      data: {
        balance: this.accounts[0]?.balance || 24580.50,
        currency: 'USD',
      },
    };
  }

  async getTransactions(accountId?: string) {
    return {
      success: true,
      data: {
        items: this.journal,
        total: this.journal.length,
      },
    };
  }

  async transfer(data: {
    transactionRef: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
  }) {
    if (data.amount <= 0) {
      throw new BadRequestException('Transfer amount must be strictly positive');
    }

    const entry: JournalEntry = {
      id: `jnl_${Date.now()}`,
      transactionRef: data.transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      amount: data.amount,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    this.journal.unshift(entry);
    return { success: true, data: entry };
  }
}
