import { Injectable } from '@nestjs/common';
import { WithdrawBody } from './withdraw.model';
import { OkxWithdrawalService } from 'okx-api-connect/services/withdrawalService';
import {
  InstrumentType,
  WithdrawalDestinationType,
} from 'okx-api-connect/types/enums';
import { ApiConfiguration } from 'okx-api-connect/types/types';
import { Session } from './types/apiTypes';
import { PrismaService } from './prisma.service';
import { OkxMarketService } from 'okx-api-connect/services/marketService';

@Injectable()
export class WithdrawService extends PrismaService {
  // make withdraw
  public async withdraw(
    body: WithdrawBody,
    apiConfiguration: ApiConfiguration,
    session: Session,
  ) {
    const okx = new OkxWithdrawalService(apiConfiguration);
    const okxMarket = new OkxMarketService(apiConfiguration);

    const { okxWithdraw, market } = await Promise.all([
      okx.postWithdrawal({
        amt: body.amount,
        fee: body.fee,
        dest: WithdrawalDestinationType.on_chain,
        ccy: body.ccy,
        chain: body.chain,
        toAddr: body.toAddress,
      }),
      okxMarket.getMarketTickers({ instType: InstrumentType.SPOT }),
    ]).then(([wd, mr]) => {
      return { okxWithdraw: wd, market: mr };
    });

    if (okxWithdraw.code !== '0') return okxWithdraw;

    // const okxWithdraw = await okx.postWithdrawal({
    //   amt: body.amount,
    //   fee: body.fee,
    //   dest: WithdrawalDestinationType.on_chain,
    //   ccy: body.ccy,
    //   chain: body.chain,
    //   toAddr: body.toAddress,
    // });

    // return okxWithdraw;

    return await this.writeWithdrawDB(okxWithdraw.data, market.data, session);
  }
}
