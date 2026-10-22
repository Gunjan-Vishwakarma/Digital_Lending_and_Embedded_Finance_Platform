export interface LoanEntity {
    id: string;
    borrowerId: string;
    borrowerName: string;
    principalAmount: number;
    interestRate: number;
    tenureMonths: number;
    purpose: string;
    monthlyIncome: number;
    employmentStatus: string;
    status: 'DRAFT' | 'UNDERWRITING' | 'FUNDING' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
    riskTier: 'A' | 'B' | 'C' | 'D' | 'E';
    creditScore: number;
    fundingProgress: number;
    monthsPaid: number;
    createdAt: string;
    updatedAt: string;
}
export declare class LoansService {
    private loans;
    createLoan(data: {
        principalAmount: number;
        tenureMonths: number;
        purpose: string;
        monthlyIncome: number;
        employmentStatus: string;
    }): Promise<{
        success: boolean;
        data: LoanEntity;
    }>;
    getLoans(): Promise<{
        success: boolean;
        data: {
            items: LoanEntity[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getLoanById(id: string): Promise<{
        success: boolean;
        data: LoanEntity;
    }>;
    getAmortizationSchedule(id: string): Promise<{
        success: boolean;
        data: {
            month: number;
            emiAmount: number;
            principalPaid: number;
            interestPaid: number;
            remainingBalance: number;
        }[];
    }>;
    repayLoan(id: string, amount: number): Promise<{
        success: boolean;
        data: {
            transactionId: string;
            monthsRemaining: number;
        };
    }>;
}
