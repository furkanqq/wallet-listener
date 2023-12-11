import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';

@Module({
  imports: [],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {}
}
