import { IsNotEmpty, IsString } from 'class-validator';
import { Address } from 'viem';

export class WithdrawRequest {
  @IsString()
  @IsNotEmpty()
  amount: string;

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
  toAddr: Address;
}
