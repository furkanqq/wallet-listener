import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OkxDepositService } from 'okx-api-connect/services/depositService';
import { ApiConfiguration, ApiResponse } from './types/apiTypes';
import { GetDepositAddressResponse } from 'okx-api-connect/types/responses';

@Injectable()
export class DepositService extends PrismaService {
  // get all deposit addresses fro given currency
  public async depositAll(ccy: string, apiConfiguration: ApiConfiguration) {
    const okx = new OkxDepositService(apiConfiguration);

    const addresses = await okx.getDepositAddress({ ccy });

    if (addresses.code !== '0') return addresses;

    const filteredAddresses = addresses.data.filter(
      (address) => address.selected,
    );

    return {
      status: 200,
      code: '0',
      message: '',
      data: filteredAddresses,
    };
  }

  // get deposit address by chain
  public async depositChain(
    chain: string,
    apiConfiguration: ApiConfiguration,
  ): Promise<ApiResponse<GetDepositAddressResponse | undefined>> {
    const okx = new OkxDepositService(apiConfiguration);

    // get deposit address from db
    const address = await this.getDepositAddressByChain(chain);

    if (address.status !== 200) return address as ApiResponse<undefined>;

    const okxAddress = await okx.getDepositAddress({ ccy: address.data.ccy });

    if (okxAddress.code !== '0') return okxAddress as ApiResponse<undefined>;

    // select users address from selected chain
    const selectedAddress = okxAddress.data.find(
      (address) => address.chain === chain,
    );

    return {
      status: 200,
      code: '0',
      message: 'Success',
      data: selectedAddress,
    };
  }
}
