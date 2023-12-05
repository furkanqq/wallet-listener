import { Injectable } from '@nestjs/common';
import { WithdrawUtils } from './withdraw.utils';
import { WithdrawBody } from './withdraw.model';
import { DepositAddress } from 'src/deposit/types/okxResponse';

@Injectable()
export class WithdrawService extends WithdrawUtils {
  // make withdraw
  public async withdraw(body: WithdrawBody) {
    const okxWithdraw = await this.okxCall<DepositAddress[]>({
      url: '/api/v5/asset/withdrawal',
      method: 'POST',
      body: {
        amt: body.amount,
        fee: body.fee,
        dest: '4',
        ccy: body.ccy,
        chain: body.chain,
        toAddr: body.toAddress,
      },
    });

    return okxWithdraw;
  }
}
