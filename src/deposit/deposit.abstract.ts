import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetDepositAddressResponse {
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  addr: string;

  @IsString()
  @IsNotEmpty()
  chain: string;

  @IsString()
  @IsNotEmpty()
  ccy: string;

  @IsString()
  @IsNotEmpty()
  network: string;

  @IsString()
  qrCode?: string;
}
