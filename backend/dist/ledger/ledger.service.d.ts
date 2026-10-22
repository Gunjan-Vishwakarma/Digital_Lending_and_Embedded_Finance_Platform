export interface LedgerAccount {
    id: string;
    userId: string;
    accountType: 'CASH_WALLET' | 'ESCROW' | 'LOAN_PRINCIPAL' | 'INTEREST_REVENUE';
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
export declare class LedgerService {
    private accounts;
    private journal;
    getAccounts(): Promise<{
        success: boolean;
        data: LedgerAccount[];
    }>;
    getBalance(): Promise<{
        success: boolean;
        data: {
            balance: number;
            currency: string;
        };
    }>;
    getTransactions(accountId?: string): Promise<{
        success: boolean;
        data: {
            items: JournalEntry[];
            total: number;
        };
    }>;
    transfer(data: {
        transactionRef: string;
        fromAccountId: string;
        toAccountId: string;
        amount: number;
        description: string;
    }): Promise<{
        success: boolean;
        data: JournalEntry;
    }>;
}
