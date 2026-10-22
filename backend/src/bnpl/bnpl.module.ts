import { Module } from '@nestjs/common';
import { BNPLController } from './bnpl.controller.js';
import { BNPLService } from './bnpl.service.js';

@Module({
  controllers: [BNPLController],
  providers: [BNPLService],
  exports: [BNPLService],
})
export class BNPLModule {}
