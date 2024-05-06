import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WithdrawalRequest } from './withdrawal.schema';
import { Model } from 'mongoose';
import { CustomOkxResponse, RedisSession } from 'src/utils/abstract';
import { WithdrawRequest } from './withdrawal.model';
import { OkxWithdrawalService } from 'okx-api-connect/services/withdrawalService';
import { OkxMarketService } from 'okx-api-connect/services/marketService';
import { PostWithdrawalRequest } from 'okx-api-connect/types/request';
import { WithdrawalDestinationType } from 'okx-api-connect/types/enums';
import {
  GetMarketTickerResponse,
  GetWithdrawalHistoryResponse,
} from 'okx-api-connect/types/responses';
import { CustomError } from 'src/utils/api/error';
import { RedisService } from 'src/utils/redis';
import { MultiFactorType } from 'src/utils/enum';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectModel(WithdrawalRequest.name)
    private withdrawalModel: Model<WithdrawalRequest>,
  ) {
    this.withdrawalModel = withdrawalModel;
  }
  _init(): void {}

  async withdraw(
    body: WithdrawRequest,
    redisSession: RedisSession,
  ): Promise<WithdrawRequest> {
    const request: PostWithdrawalRequest = {
      ...body,
      dest: WithdrawalDestinationType.on_chain,
    };

    const { user, apiConfiguration } = redisSession;

    const withdrawalResponse: GetWithdrawalHistoryResponse[] =
      await new OkxWithdrawalService(apiConfiguration)
        .postWithdrawal(request)
        .then((response: CustomOkxResponse<GetWithdrawalHistoryResponse>) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new CustomError(
            response.message,
            response.code,
            response.status,
          );
        });

    let usdtEqual = '1';
    if (body.ccy !== 'USDT') {
      const tickerPrice = await new OkxMarketService(apiConfiguration)
        .getMarketTicker({ instId: body.ccy + '-USDT' })
        .then((response: CustomOkxResponse<GetMarketTickerResponse>) => {
          if (response.status === 200) {
            return response.data;
          }
        });

      usdtEqual = (Number(tickerPrice[0].last) * Number(body.amt)).toString();
    }

    this.withdrawalModel.create({
      _id: withdrawalResponse[0].wdId,
      subAccount: user.subAccount,
      customerId: user.id,
      ccy: body.ccy,
      chain: body.chain,
      amt: body.amt,
      toAddr: body.toAddr,
      wdId: withdrawalResponse[0].wdId,
      clientId: withdrawalResponse[0].clientId,
      dest: WithdrawalDestinationType.on_chain,
      usdtEqual: usdtEqual,
    });

    const redisService = new RedisService();
    await redisService.deleteMultiFactorSession(
      redisSession.id,
      MultiFactorType.WITHDRAWAL,
    );

    return this.withdrawalModel.findOne({ wdId: withdrawalResponse[0].wdId });
  }
}
