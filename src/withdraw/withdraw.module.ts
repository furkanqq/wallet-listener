import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [WithdrawController],
  providers: [
    WithdrawService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class WithdrawModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {}
}
