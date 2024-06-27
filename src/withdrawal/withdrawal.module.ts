import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WithdrawalRequest,
  WithdrawalRequestSchema,
} from '../schema/withdrawal.schema';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import {
  DepositAddress,
  DepositAddressSchema,
} from 'src/schema/deposit.schema';
import { Balance, BalanceSchema } from 'src/schema/balance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WithdrawalRequest.name, schema: WithdrawalRequestSchema },
      { name: Balance.name, schema: BalanceSchema },
    ]),
  ],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes(WithdrawalController);
  }
}
