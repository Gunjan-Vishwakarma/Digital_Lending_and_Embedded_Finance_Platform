var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException } from '@nestjs/common';
let LoansService = class LoansService {
    loans = [
        {
            id: 'LN-8492',
            borrowerId: 'usr_borrower_01',
            borrowerName: 'Alex Vance',
            principalAmount: 10000,
            interestRate: 8.5,
            tenureMonths: 24,
            purpose: 'Debt Consolidation',
            monthlyIncome: 4500,
            employmentStatus: 'Full-Time Tech',
            status: 'ACTIVE',
            riskTier: 'B',
            creditScore: 742,
            fundingProgress: 100,
            monthsPaid: 6,
            createdAt: '2026-04-10T10:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
        {
            id: 'LN-7819',
            borrowerId: 'usr_borrower_01',
            borrowerName: 'Alex Vance',
            principalAmount: 5000,
            interestRate: 7.2,
            tenureMonths: 12,
            purpose: 'Home Improvement',
            monthlyIncome: 4500,
            employmentStatus: 'Full-Time Tech',
            status: 'ACTIVE',
            riskTier: 'A',
            creditScore: 780,
            fundingProgress: 100,
            monthsPaid: 4,
            createdAt: '2026-06-15T12:00:00Z',
            updatedAt: '2026-10-22T10:00:00Z',
        },
        {
            id: 'LN-9201',
            borrowerId: 'usr_b_112',
            borrowerName: 'Marcus Bennett',
            principalAmount: 15000,
            interestRate: 9.8,
            tenureMonths: 24,
            purpose: 'Small Business Equipment Expansion',
            monthlyIncome: 6200,
            employmentStatus: 'Founder, Logistics',
            status: 'FUNDING',
            riskTier: 'B',
            creditScore: 718,
            fundingProgress: 75,
            monthsPaid: 0,
            createdAt: '2026-10-22T08:30:00Z',
            updatedAt: '2026-10-22T08:30:00Z',
        },
    ];
    async createLoan(data) {
        const creditScore = Math.floor(660 + Math.random() * 120);
        const riskTier = creditScore >= 750 ? 'A' : creditScore >= 700 ? 'B' : creditScore >= 640 ? 'C' : 'D';
        const interestRate = riskTier === 'A' ? 6.5 : riskTier === 'B' ? 8.5 : riskTier === 'C' ? 12.0 : 16.5;
        const newLoan = {
            id: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
            borrowerId: 'usr_borrower_01',
            borrowerName: 'Alex Vance',
            principalAmount: data.principalAmount,
            interestRate,
            tenureMonths: data.tenureMonths,
            purpose: data.purpose,
            monthlyIncome: data.monthlyIncome,
            employmentStatus: data.employmentStatus,
            status: riskTier === 'A' ? 'FUNDING' : 'UNDERWRITING',
            riskTier,
            creditScore,
            fundingProgress: 0,
            monthsPaid: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.loans.unshift(newLoan);
        return { success: true, data: newLoan };
    }
    async getLoans() {
        return {
            success: true,
            data: {
                items: this.loans,
                total: this.loans.length,
                page: 1,
                limit: 10,
                totalPages: 1,
            },
        };
    }
    async getLoanById(id) {
        const loan = this.loans.find((l) => l.id === id);
        if (!loan)
            throw new NotFoundException(`Loan ${id} not found`);
        return { success: true, data: loan };
    }
    async getAmortizationSchedule(id) {
        const loan = this.loans.find((l) => l.id === id);
        if (!loan)
            throw new NotFoundException(`Loan ${id} not found`);
        const p = loan.principalAmount;
        const r = loan.interestRate / 100 / 12;
        const n = loan.tenureMonths;
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        let balance = p;
        const schedule = [];
        for (let month = 1; month <= n; month++) {
            const interest = balance * r;
            const principal = emi - interest;
            balance = Math.max(0, balance - principal);
            schedule.push({
                month,
                emiAmount: Math.round(emi * 100) / 100,
                principalPaid: Math.round(principal * 100) / 100,
                interestPaid: Math.round(interest * 100) / 100,
                remainingBalance: Math.round(balance * 100) / 100,
            });
        }
        return { success: true, data: schedule };
    }
    async repayLoan(id, amount) {
        const loan = this.loans.find((l) => l.id === id);
        if (!loan)
            throw new NotFoundException(`Loan ${id} not found`);
        loan.monthsPaid += 1;
        if (loan.monthsPaid >= loan.tenureMonths) {
            loan.status = 'CLOSED';
        }
        return {
            success: true,
            data: {
                transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                monthsRemaining: Math.max(0, loan.tenureMonths - loan.monthsPaid),
            },
        };
    }
};
LoansService = __decorate([
    Injectable()
], LoansService);
export { LoansService };
//# sourceMappingURL=loans.service.js.map