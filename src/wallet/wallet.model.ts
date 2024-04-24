import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TransferRequest {
  @IsString()
  @IsNotEmpty()
  ccy: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsBoolean()
  @IsNotEmpty()
  toTrade: boolean;
}
