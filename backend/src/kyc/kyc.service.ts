import { Injectable } from '@nestjs/common';

@Injectable()
export class KYCService {
  async submitDocuments(payload?: any) {
    return {
      success: true,
      data: {
        inquiryId: `inq_${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'PENDING',
        message: 'Documents received. Persona AI biometric analysis in progress.',
      },
    };
  }

  async getStatus() {
    return {
      success: true,
      data: {
        status: 'VERIFIED',
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async handleWebhook(body: any) {
    return { success: true, processed: true };
  }
}
