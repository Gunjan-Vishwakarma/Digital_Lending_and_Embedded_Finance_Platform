import { Controller, Post, Body } from '@nestjs/common';
import { BNPLService } from './bnpl.service.js';

@Controller('bnpl')
export class BNPLController {
  constructor(private readonly bnplService: BNPLService) {}

  @Post('prequalify')
  async prequalify(@Body() body: { amount: number; userId?: string }) {
    return this.bnplService.prequalify(body);
  }

  @Post('checkout')
  async checkout(@Body() body: any) {
    return this.bnplService.checkout(body);
  }
}
