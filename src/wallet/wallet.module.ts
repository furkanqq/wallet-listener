import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {}
}
