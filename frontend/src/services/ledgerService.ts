import api from './api';
import type { ApiResponse } from '../types/api';

export interface LedgerAccount {
  id: string;
  userId: string;
  accountType: string;
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

export const ledgerService = {
  async getAccounts(): Promise<ApiResponse<LedgerAccount[]>> {
    const { data } = await api.get('/ledger/accounts');
    return data;
  },

  async getTransactions(
    accountId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ items: JournalEntry[]; total: number }>> {
    const { data } = await api.get(`/ledger/accounts/${accountId}/transactions`, {
      params: { page, limit },
    });
    return data;
  },

  async getBalance(): Promise<ApiResponse<{ balance: number; currency: string }>> {
    const { data } = await api.get('/ledger/balance');
    return data;
  },
};
