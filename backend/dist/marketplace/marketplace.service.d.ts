export declare class MarketplaceService {
    private marketplaceLoans;
    getMarketplaceLoans(query?: any): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                purpose: string;
                borrowerName: string;
                creditScore: number;
                riskTier: string;
                requestedAmount: number;
                fundedAmount: number;
                grossYield: number;
                tenureMonths: number;
                daysRemaining: number;
            }[];
            total: number;
        };
    }>;
    fundLoan(data: {
        loanId: string;
        amount: number;
    }): Promise<{
        success: boolean;
        data: {
            investmentId: string;
            escrowTxnRef: string;
        };
    }>;
}
