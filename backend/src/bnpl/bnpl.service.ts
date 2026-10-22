import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BNPLService {
  async prequalify(data: { amount: number; userId?: string }) {
    if (!data.amount || data.amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const amt = data.amount;
    return {
      success: true,
      data: {
        eligible: true,
        maxCreditLimit: 2500,
        plans: [
          {
            type: 'PAY_IN_4',
            installments: 4,
            amount: Math.round((amt / 4) * 100) / 100,
            apr: 0,
            interval: 'bi-weekly',
          },
          {
            type: 'PAY_IN_6',
            installments: 6,
            amount: Math.round((amt / 6) * 100) / 100,
            apr: 0,
            interval: 'monthly',
          },
          {
            type: 'PAY_IN_12',
            installments: 12,
            amount: Math.round(((amt * 1.045) / 12) * 100) / 100,
            apr: 7.5,
            interval: 'monthly',
          },
        ],
      },
    };
  }

  async checkout(data: {
    merchantId: string;
    amount: number;
    planType: string;
    items?: any[];
  }) {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const loanId = `LN-BNPL-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      data: {
        orderId,
        loanId,
        disbursementStatus: 'SETTLED_TO_MERCHANT',
        disbursedAmount: data.amount,
        firstPaymentDue: 'TODAY',
        message: 'Order confirmed and merchant credited via ledger.',
      },
    };
  }
}
