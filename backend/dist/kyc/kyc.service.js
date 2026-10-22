var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let KYCService = class KYCService {
    async submitDocuments(payload) {
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
    async handleWebhook(body) {
        return { success: true, processed: true };
    }
};
KYCService = __decorate([
    Injectable()
], KYCService);
export { KYCService };
//# sourceMappingURL=kyc.service.js.map