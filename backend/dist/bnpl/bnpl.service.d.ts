export declare class BNPLService {
    prequalify(data: {
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
    checkout(data: {
        merchantId: string;
        amount: number;
        planType: string;
        items?: any[];
    }): Promise<{
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
