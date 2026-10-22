import { KYCService } from './kyc.service.js';
export declare class KYCController {
    private readonly kycService;
    constructor(kycService: KYCService);
    submit(body: any): Promise<{
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
    webhook(body: any): Promise<{
        success: boolean;
        processed: boolean;
    }>;
}
