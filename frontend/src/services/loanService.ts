import api from './api';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Loan, LoanApplication, AmortizationEntry, CreditScore } from '../types/loan';

export const loanService = {
  async createLoan(application: LoanApplication): Promise<ApiResponse<Loan>> {
    const { data } = await api.post('/loans', application);
    return data;
  },

  async getLoans(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    const { data } = await api.get('/loans', { params: { page, limit } });
    return data;
  },

  async getLoanById(id: string): Promise<ApiResponse<Loan>> {
    const { data } = await api.get(`/loans/${id}`);
    return data;
  },

  async getAmortizationSchedule(loanId: string): Promise<ApiResponse<AmortizationEntry[]>> {
    const { data } = await api.get(`/loans/${loanId}/schedule`);
    return data;
  },

  async getCreditScore(loanId: string): Promise<ApiResponse<CreditScore>> {
    const { data } = await api.get(`/loans/${loanId}/credit-score`);
    return data;
  },

  async makeRepayment(
    loanId: string,
    amount: number,
    idempotencyKey: string
  ): Promise<ApiResponse<{ transactionId: string }>> {
    const { data } = await api.post(
      `/loans/${loanId}/repay`,
      { amount },
      { headers: { 'X-Idempotency-Key': idempotencyKey } }
    );
    return data;
  },

  async getMarketplaceLoans(
    filters: Record<string, unknown>,
    page = 1,
    limit = 12
  ): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    const { data } = await api.get('/marketplace', { params: { ...filters, page, limit } });
    return data;
  },

  async fundLoan(
    loanId: string,
    amount: number,
    idempotencyKey: string
  ): Promise<ApiResponse<{ investmentId: string }>> {
    const { data } = await api.post(
      '/investments',
      { loanId, amount },
      { headers: { 'X-Idempotency-Key': idempotencyKey } }
    );
    return data;
  },
};
