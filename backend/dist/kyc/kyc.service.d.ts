export declare class KYCService {
    submitDocuments(payload?: any): Promise<{
        success: boolean;
        data: {
            inquiryId: string;
            status: string;
            message: string;
        };
    }>;
    getStatus(): Promise<{
        success: boolean;
        data: {
            status: string;
            updatedAt: string;
        };
    }>;
    handleWebhook(body: any): Promise<{
        success: boolean;
        processed: boolean;
    }>;
}
