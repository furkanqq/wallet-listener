import { Injectable } from '@nestjs/common';
import { DepositUtils } from './deposit.utils';
import { PrismaService } from './prisma.service';
import { DepositAddress } from './types/okxResponse';

@Injectable()
export class DepositService extends DepositUtils {
  prisma = new PrismaService();

  // get all deposit addresses fro given currency
  public async depositAll(ccy: string) {
    const addresses = await this.okxCall<DepositAddress[]>({
      url: '/api/v5/asset/deposit-address',
      method: 'GET',
      params: { ccy: ccy.toUpperCase() },
    });

    if (addresses.code !== '0') return addresses;

    const filteredAddresses = addresses.data.filter(
      (address) => address.selected,
    );

    return await this.prisma.updateDepositAddresses(filteredAddresses);
  }

  // get deposit address by chain
  public async depositChain(chain: string) {
    // get deposit address from db
    const address = await this.prisma.getDepositAddressByChain(chain);

    if (address.status !== 200)
      return {
        status: 400,
        code: '0',
        message: 'Deposit address not found',
      };

    // get all deposit addresses from okx by currency
    const okxAddress = await this.okxCall<DepositAddress[]>({
      url: '/api/v5/asset/deposit-address',
      method: 'GET',
      params: { ccy: address.data.ccy },
    });

    if (okxAddress.code !== '0')
      return {
        status: okxAddress.status,
        code: okxAddress.code,
        message: okxAddress.message,
      };

    // select users address from selected chain
    const selectedAddress = okxAddress.data.find(
      (address) => address.chain === chain,
    );

    return {
      status: 200,
      code: '0',
      message: 'Success',
      data: selectedAddress.addr,
    };
  }
}
