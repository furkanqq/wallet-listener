import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from 'viem';

@Schema()
export class Coin {
  @Prop()
  _id: string;

  @Prop({ default: false })
  canDep: boolean;

  @Prop({ default: '' })
  address: '' | Address;

  @Prop({ default: false })
  canInternal: boolean;

  @Prop({ default: false })
  canWd: boolean;

  @Prop()
  ccy: string;

  @Prop({ unique: true })
  chain: string;

  @Prop()
  depQuotaFixed: string;

  @Prop()
  depQuoteDailyLayer2: string;

  @Prop()
  logoLink: string;

  @Prop({ default: false })
  mainNet: boolean;

  @Prop()
  maxFee: string;

  @Prop()
  maxFeeForCtAddr: string;

  @Prop()
  maxWd: string;

  @Prop()
  minDep: string;

  @Prop()
  minDepArrivalConfirm: string;

  @Prop()
  minFee: string;

  @Prop()
  minFeeForCtAddr: string;

  @Prop()
  minWd: string;

  @Prop()
  minWdUnlockConfirm: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  needTag: boolean;

  @Prop()
  usedDepQuotaFixed: string;

  @Prop()
  usedWdQuota: string;

  @Prop()
  wdQuota: string;

  @Prop()
  wdTickSz: string;

  @Prop({ default: false })
  active: boolean;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);
