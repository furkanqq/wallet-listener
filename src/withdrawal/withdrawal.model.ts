import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawRequest {
  @IsString()
  @IsNotEmpty()
  amt: string;

  @IsString()
  @IsNotEmpty()
  fee: string;

  @IsString()
  @IsNotEmpty()
  ccy: string;

  @IsString()
  @IsNotEmpty()
  chain: string;

  @IsString()
  @IsNotEmpty()
  toAddr: string;
}
