import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositAddress, DepositAddressSchema } from './deposit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DepositAddress.name, schema: DepositAddressSchema },
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
