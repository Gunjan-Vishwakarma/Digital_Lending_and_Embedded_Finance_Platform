export type LoanStatus = 'DRAFT' | 'UNDERWRITING' | 'FUNDING' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
export type RiskTier = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Loan {
  id: string;
  borrowerId: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  status: LoanStatus;
  purpose: string;
  riskTier?: RiskTier;
  creditScore?: number;
  fundingProgress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AmortizationEntry {
  month: number;
  emiAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanApplication {
  principalAmount: number;
  tenureMonths: number;
  purpose: string;
  monthlyIncome: number;
  employmentStatus: string;
  acceptAlternativeDataConsent: boolean;
}

export interface CreditScore {
  score: number;
  riskTier: RiskTier;
  interestRate: number;
  defaultProbability: number;
  shapValues: ShapFeature[];
}

export interface ShapFeature {
  feature: string;
  value: number;
  impact: 'positive' | 'negative';
  description: string;
}

export interface Investment {
  id: string;
  lenderId: string;
  loanId: string;
  amount: number;
  status: 'COMMITTED' | 'ACTIVE' | 'RETURNED';
  loan?: Loan;
  createdAt: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  monthNumber: number;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  dueDate: string;
  paidAt?: string;
}

export interface MarketplaceFilters {
  riskTier?: RiskTier[];
  minYield?: number;
  maxYield?: number;
  tenureRange?: [number, number];
  minAmount?: number;
  maxAmount?: number;
}
