import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LedgerService } from './ledger.service.js';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('accounts')
  async getAccounts() {
    return this.ledgerService.getAccounts();
  }

  @Get('balance')
  async getBalance() {
    return this.ledgerService.getBalance();
  }

  @Get('accounts/:id/transactions')
  async getTransactions(@Param('id') id: string) {
    return this.ledgerService.getTransactions(id);
  }

  @Post('transfer')
  async transfer(@Body() body: any) {
    return this.ledgerService.transfer(body);
  }
}
