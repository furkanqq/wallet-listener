import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class DepositHistory {
  @Prop({ type: String, default: () => v4() })
  _id: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  tokenAddress: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  network: string;

  @Prop({ required: true })
  blockNumber: string;

  @Prop({ required: true })
  transactionHash: string;
}

export const DepositHistorySchema =
  SchemaFactory.createForClass(DepositHistory);
