import { MarketplaceService } from './marketplace.service.js';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    getMarketplace(query: any): Promise<{
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
    fundLoan(body: {
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
