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
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    DepositModule,
    WithdrawalModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
