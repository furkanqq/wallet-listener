import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class DepositAddress {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop()
  subAccount: string;

  @Prop()
  customerId: number;

  @Prop()
  chain: string;

  @Prop()
  ctAddr: string;

  @Prop()
  ccy: string;

  @Prop()
  to: string;

  @Prop()
  addr: string;

  @Prop()
  selected: boolean;
}

export const DepositAddressSchema =
  SchemaFactory.createForClass(DepositAddress);
