import { LoansService } from './loans.service.js';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    getLoans(): Promise<{
        success: boolean;
        data: {
            items: import("./loans.service.js").LoanEntity[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createLoan(body: any): Promise<{
        success: boolean;
        data: import("./loans.service.js").LoanEntity;
    }>;
    getLoanById(id: string): Promise<{
        success: boolean;
        data: import("./loans.service.js").LoanEntity;
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
    repayLoan(id: string, body: {
        amount: number;
    }): Promise<{
        success: boolean;
        data: {
            transactionId: string;
            monthsRemaining: number;
        };
    }>;
}
