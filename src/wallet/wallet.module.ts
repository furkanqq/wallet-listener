import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletMiddleware } from './wallet.middleware';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WalletMiddleware).forRoutes(WalletController);
  }
}
