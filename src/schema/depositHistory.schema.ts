import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class DepositHistory {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop({ required: true })
  customerId: number;

  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  tokenAddress: string;

  @Prop({ required: true })
  toAddr: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  network: string;

  @Prop({ required: true })
  blockNumber: string;

  @Prop({ required: true })
  txHash: string;
}

export const DepositHistorySchema =
  SchemaFactory.createForClass(DepositHistory);
