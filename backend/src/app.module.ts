import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { LoansModule } from './loans/loans.module.js';
import { LedgerModule } from './ledger/ledger.module.js';
import { MarketplaceModule } from './marketplace/marketplace.module.js';
import { KYCModule } from './kyc/kyc.module.js';
import { BNPLModule } from './bnpl/bnpl.module.js';

@Module({
  imports: [
    AuthModule,
    LoansModule,
    LedgerModule,
    MarketplaceModule,
    KYCModule,
    BNPLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
