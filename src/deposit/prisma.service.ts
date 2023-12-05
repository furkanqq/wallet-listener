import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DepositAddress } from './types/okxResponse';
import { ApiResponse } from './types/apiTypes';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // update deposit addresses on db
  public async updateDepositAddresses(
    addresses: DepositAddress[],
  ): Promise<ApiResponse<DepositAddress[] | undefined>> {
    const dbAddressses = await this.depositAddresses.findMany();

    // adding owner to addresses
    addresses.map(
      (address) => (address.owner = `${process.env.UID}-${address.chain}`),
    );

    if (dbAddressses.length > 0) {
      // updating db
      const updateAddresses = addresses.map(async (address) => {
        await this.depositAddresses.upsert({
          where: { owner: address.owner },
          update: address,
          create: address,
        });
      });

      const result = await Promise.all([updateAddresses])
        .then(() => {
          return {
            status: 200,
            message: 'Deposit addresses updated succesfully',
            code: '0',
            data: addresses,
          };
        })
        .catch((err: Error) => {
          return {
            status: 500,
            message: err.message,
            code: '0',
          };
        });

      return result;
    }

    // addind addresses to db
    return await this.depositAddresses
      .createMany({ data: addresses })
      .then(() => {
        return {
          status: 200,
          code: '0',
          message: 'Deposit addresses added database succesfully',
          data: addresses,
        };
      })
      .catch((err: Error) => {
        return {
          status: 500,
          code: '0',
          message: err.message,
        };
      });
  }

  // get users selected deposit address by chain from db
  public async getDepositAddressByChain(
    chain: string,
  ): Promise<ApiResponse<DepositAddress | undefined>> {
    const addressResponse = await this.depositAddresses
      .findUnique({
        where: { chain: chain, owner: `${process.env.UID}-${chain}` },
      })
      .then((res) => {
        if (!res) {
          return {
            status: 400,
            code: '0',
            message: 'Deposit address not found',
          };
        }

        return {
          status: 200,
          code: '0',
          message: 'Success',
          data: res,
        };
      })
      .catch((e: Error) => {
        return {
          status: 500,
          code: '0',
          message: e.message,
        };
      });

    return addressResponse;
  }
}
