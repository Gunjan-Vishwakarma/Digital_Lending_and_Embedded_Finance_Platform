import { LedgerService } from './ledger.service.js';
export declare class LedgerController {
    private readonly ledgerService;
    constructor(ledgerService: LedgerService);
    getAccounts(): Promise<{
        success: boolean;
        data: import("./ledger.service.js").LedgerAccount[];
    }>;
    getBalance(): Promise<{
        success: boolean;
        data: {
            balance: number;
            currency: string;
        };
    }>;
    getTransactions(id: string): Promise<{
        success: boolean;
        data: {
            items: import("./ledger.service.js").JournalEntry[];
            total: number;
        };
    }>;
    transfer(body: any): Promise<{
        success: boolean;
        data: import("./ledger.service.js").JournalEntry;
    }>;
}
