import { IsNotEmpty, IsString } from 'class-validator';

export class BalanceModel {
  @IsString()
  @IsNotEmpty()
  ccy: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
