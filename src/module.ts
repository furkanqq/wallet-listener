import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DepositModule } from './deposit/deposit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { AuthGuard } from './utils/api/guard';
import { VerificationGuard } from './utils/api/verification';
import { MultiFactorType } from './utils/enum';
import { KycGuard } from './utils/api/kyc';
import { BalanceModule } from './balance/balance.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BalanceModule,
    DepositModule,
    WithdrawalModule,
  ],
  controllers: [],
  providers: [
    AuthGuard,
    {
      provide: VerificationGuard,
      useValue: new VerificationGuard(MultiFactorType.AUTHENTICATE),
    },
    KycGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
