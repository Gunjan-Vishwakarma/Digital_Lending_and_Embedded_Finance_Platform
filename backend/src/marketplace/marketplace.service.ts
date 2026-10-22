import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  private marketplaceLoans = [
    {
      id: 'LN-9201',
      purpose: 'Small Business Equipment Expansion',
      borrowerName: 'Marcus Bennett',
      creditScore: 718,
      riskTier: 'B',
      requestedAmount: 15000,
      fundedAmount: 11250,
      grossYield: 9.8,
      tenureMonths: 24,
      daysRemaining: 4,
    },
    {
      id: 'LN-9450',
      purpose: 'Medical Clinic Diagnostic Upgrade',
      borrowerName: 'Dr. Rachel Patel',
      creditScore: 785,
      riskTier: 'A',
      requestedAmount: 25000,
      fundedAmount: 21500,
      grossYield: 6.8,
      tenureMonths: 36,
      daysRemaining: 7,
    },
    {
      id: 'LN-9612',
      purpose: 'Commercial Kitchen Fleet Expansion',
      borrowerName: 'Carlos Gomez',
      creditScore: 662,
      riskTier: 'C',
      requestedAmount: 8000,
      fundedAmount: 3200,
      grossYield: 13.5,
      tenureMonths: 18,
      daysRemaining: 11,
    },
  ];

  async getMarketplaceLoans(query?: any) {
    return {
      success: true,
      data: {
        items: this.marketplaceLoans,
        total: this.marketplaceLoans.length,
      },
    };
  }

  async fundLoan(data: { loanId: string; amount: number }) {
    if (!data.amount || data.amount < 100) {
      throw new BadRequestException('Minimum investment commitment is $100');
    }

    const loan = this.marketplaceLoans.find((l) => l.id === data.loanId);
    if (loan) {
      loan.fundedAmount = Math.min(loan.requestedAmount, loan.fundedAmount + data.amount);
    }

    return {
      success: true,
      data: {
        investmentId: `INV-${Math.floor(100 + Math.random() * 900)}`,
        escrowTxnRef: `ESCROW_LOCK_${Date.now()}`,
      },
    };
  }
}
