import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WithdrawalDestinationType } from 'okx-api-connect/types/enums';

@Schema()
export class WithdrawalRequest {
  @Prop({ type: String })
  _id: string;

  @Prop()
  subAccount: string;

  @Prop()
  customerId: number;

  @Prop()
  ccy: string;

  @Prop()
  chain: string;

  @Prop()
  amt: string;

  @Prop()
  toAddr: string;

  @Prop()
  wdId: string;

  @Prop()
  clientId: string;

  @Prop()
  dest: WithdrawalDestinationType;

  @Prop()
  usdtEqual: string;
}

export const WithdrawalRequestSchema =
  SchemaFactory.createForClass(WithdrawalRequest);
