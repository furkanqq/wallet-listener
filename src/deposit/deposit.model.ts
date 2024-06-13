import { IsNotEmpty, IsString } from 'class-validator';

export class GetDepositAddressRequest {
  @IsString()
  @IsNotEmpty()
  network: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;
}
