import { BNPLService } from './bnpl.service.js';
export declare class BNPLController {
    private readonly bnplService;
    constructor(bnplService: BNPLService);
    prequalify(body: {
        amount: number;
        userId?: string;
    }): Promise<{
        success: boolean;
        data: {
            eligible: boolean;
            maxCreditLimit: number;
            plans: {
                type: string;
                installments: number;
                amount: number;
                apr: number;
                interval: string;
            }[];
        };
    }>;
    checkout(body: any): Promise<{
        success: boolean;
        data: {
            orderId: string;
            loanId: string;
            disbursementStatus: string;
            disbursedAmount: number;
            firstPaymentDue: string;
            message: string;
        };
    }>;
}
