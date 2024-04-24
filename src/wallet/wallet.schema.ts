import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { WalletType } from './wallet.enum';

@Schema()
export class Wallet {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop()
  subAccount: string;

  @Prop()
  customerId: number;

  @Prop()
  ccy: string;

  @Prop()
  balance: string;

  @Prop()
  availableBalance: string;

  @Prop()
  frozenBalance: string;

  @Prop()
  walletType: WalletType;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
