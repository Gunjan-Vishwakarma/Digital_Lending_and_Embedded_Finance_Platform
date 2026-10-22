import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LoansService } from './loans.service.js';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  async getLoans() {
    return this.loansService.getLoans();
  }

  @Post()
  async createLoan(@Body() body: any) {
    return this.loansService.createLoan(body);
  }

  @Get(':id')
  async getLoanById(@Param('id') id: string) {
    return this.loansService.getLoanById(id);
  }

  @Get(':id/schedule')
  async getAmortizationSchedule(@Param('id') id: string) {
    return this.loansService.getAmortizationSchedule(id);
  }

  @Post(':id/repay')
  async repayLoan(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.loansService.repayLoan(id, body.amount);
  }
}
