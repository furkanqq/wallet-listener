import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Balance, BalanceSchema } from 'src/schema/balance.schema';
import { BalanceInitializer } from './balance.initializer';
import {
  DepositAddress,
  DepositAddressSchema,
} from 'src/schema/deposit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Balance.name, schema: BalanceSchema },
      { name: DepositAddress.name, schema: DepositAddressSchema },
    ]),
  ],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceInitializer],
})
export class BalanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes(BalanceController);
  }
}
