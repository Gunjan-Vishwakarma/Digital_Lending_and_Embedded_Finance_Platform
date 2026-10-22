var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let AuthService = class AuthService {
    users = [
        {
            id: 'usr_borrower_01',
            email: 'borrower@nexfin.io',
            role: 'BORROWER',
            kycStatus: 'VERIFIED',
            firstName: 'Alex',
            lastName: 'Vance',
            createdAt: '2026-01-15T10:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
        {
            id: 'usr_lender_02',
            email: 'lender@nexfin.io',
            role: 'LENDER',
            kycStatus: 'VERIFIED',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            createdAt: '2026-02-10T12:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
        {
            id: 'usr_admin_03',
            email: 'admin@nexfin.io',
            role: 'ADMIN',
            kycStatus: 'VERIFIED',
            firstName: 'Elena',
            lastName: 'Rostova',
            createdAt: '2026-01-01T08:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
        {
            id: 'usr_merchant_04',
            email: 'merchant@nexfin.io',
            role: 'MERCHANT',
            kycStatus: 'VERIFIED',
            firstName: 'David',
            lastName: 'Cho',
            createdAt: '2026-03-05T14:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
    ];
    async login(credentials) {
        let user = this.users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (!user) {
            const role = credentials.email.includes('admin')
                ? 'ADMIN'
                : credentials.email.includes('lender')
                    ? 'LENDER'
                    : credentials.email.includes('merchant')
                        ? 'MERCHANT'
                        : 'BORROWER';
            user = {
                id: `usr_${Date.now()}`,
                email: credentials.email,
                role,
                kycStatus: 'VERIFIED',
                firstName: credentials.email.split('@')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.users.push(user);
        }
        return {
            success: true,
            data: {
                user,
                accessToken: `jwt_token_${user.id}_${Date.now()}`,
                expiresIn: 3600,
            },
        };
    }
    async register(payload) {
        const existing = this.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
        if (existing) {
            return { success: true, data: { user: existing, accessToken: `jwt_token_${existing.id}`, expiresIn: 3600 } };
        }
        const newUser = {
            id: `usr_${Date.now()}`,
            email: payload.email,
            role: payload.role || 'BORROWER',
            kycStatus: 'VERIFIED',
            firstName: payload.firstName,
            lastName: payload.lastName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.users.push(newUser);
        return {
            success: true,
            data: {
                user: newUser,
                accessToken: `jwt_token_${newUser.id}`,
                expiresIn: 3600,
            },
        };
    }
    async getProfile(userId) {
        const user = this.users[0];
        return { success: true, data: user };
    }
};
AuthService = __decorate([
    Injectable()
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map