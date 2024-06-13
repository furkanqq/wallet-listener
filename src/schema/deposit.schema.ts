import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class DepositAddress {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop({ required: true })
  customerId: number;

  @Prop({ required: true })
  subAccount: string;


  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  ccy: string;

  @Prop({ required: true })
  addr: string;

  @Prop({ required: true })
  network: string;
}

export const DepositAddressSchema =
  SchemaFactory.createForClass(DepositAddress);
