import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositAddress, DepositAddressSchema } from '../schema/deposit.schema';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';
import { Coin, CoinSchema } from 'src/schema/coin.schema';
import { DepositInitializer } from './deposit.initializer';
import { Balance, BalanceSchema } from 'src/schema/balance.schema';
import { DepositHistory, DepositHistorySchema } from 'src/schema/depositHistory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DepositAddress.name, schema: DepositAddressSchema },
      { name: DepositHistory.name, schema: DepositHistorySchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Coin.name, schema: CoinSchema },
      { name: Balance.name, schema: BalanceSchema },
    ]),
  ],
  controllers: [DepositController],
  providers: [DepositService, DepositInitializer],
})
export class DepositModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes(DepositController);
  }
}
