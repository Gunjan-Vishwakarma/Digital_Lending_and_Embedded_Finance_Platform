import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service.js';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async getMarketplace(@Query() query: any) {
    return this.marketplaceService.getMarketplaceLoans(query);
  }

  @Post('invest')
  async fundLoan(@Body() body: { loanId: string; amount: number }) {
    return this.marketplaceService.fundLoan(body);
  }
}
