import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class Balance {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop({ required: true })
  customerId: number;

  @Prop({ required: true })
  ccy: string;

  @Prop({ required: true })
  balance: string;

  @Prop({ required: true })
  availableBalance: string;

  @Prop({ required: true })
  frozenBalance: string;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
