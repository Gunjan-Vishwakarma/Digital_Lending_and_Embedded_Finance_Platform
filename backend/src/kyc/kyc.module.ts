import { Module } from '@nestjs/common';
import { KYCController } from './kyc.controller.js';
import { KYCService } from './kyc.service.js';

@Module({
  controllers: [KYCController],
  providers: [KYCService],
  exports: [KYCService],
})
export class KYCModule {}
