import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from './types/apiTypes';
import { Coin } from './types/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // get users selected deposit address by chain from db
  public async getDepositAddressByChain(
    chain: string,
  ): Promise<ApiResponse<Coin | undefined>> {
    const addressResponse = await this.coins
      .findUnique({
        where: { chain: chain },
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
          code: '100-1000',
          message: e.message,
        };
      });

    return addressResponse;
  }
}
