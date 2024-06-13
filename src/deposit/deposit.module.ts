import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositAddress, DepositAddressSchema } from '../schema/deposit.schema';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DepositAddress.name, schema: DepositAddressSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes(DepositController);
  }
}
