import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AppMiddleware } from './middleware';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawModule } from './withdraw/withdraw.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WalletModule,
    DepositModule,
    WithdrawModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
