import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, Session } from './types/apiTypes';
import {
  GetMarketTickersResponse,
  PostWithdrawalResponse,
} from 'okx-api-connect/types/responses';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // write withdraw to db
  public async writeWithdrawDB(
    withdraw: PostWithdrawalResponse[],
    market: GetMarketTickersResponse[],
    session: Session,
  ): Promise<ApiResponse<any | undefined>> {
    const usdt =
      withdraw[0].ccy === 'USDT'
        ? 1
        : Number(
            market.find((m) => m.instId === `${withdraw[0].ccy}-USDT`).last,
          );

    const addressResponse = await this.withdrawals
      .create({
        data: {
          ...withdraw[0],
          usdtEqual: (Number(withdraw[0].amt) * usdt).toString(),
          subAccount: session.subAccount,
        },
      })
      .then((res) => {
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
