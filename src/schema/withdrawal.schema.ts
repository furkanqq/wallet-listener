import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class WithdrawalRequest {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop({ required: true })
  customerId: number;

  @Prop({ required: true })
  subAccount: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  ccy: string;

  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  fee: string;

  @Prop({ required: true })
  toAddr: string;
}

export const WithdrawalRequestSchema =
  SchemaFactory.createForClass(WithdrawalRequest);
