import { Controller, Post, Get, Body } from '@nestjs/common';
import { KYCService } from './kyc.service.js';

@Controller('kyc')
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Post('submit')
  async submit(@Body() body: any) {
    return this.kycService.submitDocuments(body);
  }

  @Get('status')
  async getStatus() {
    return this.kycService.getStatus();
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    return this.kycService.handleWebhook(body);
  }
}
