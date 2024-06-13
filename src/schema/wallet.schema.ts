import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { Address } from 'viem';

@Schema()
export class Wallet {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop()
  subAccount: string;

  @Prop()
  customerId: number;

  @Prop()
  address: Address;

  @Prop()
  privateKey: string;

  @Prop()
  publicKey: Address;

  @Prop()
  seedPhrase: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
