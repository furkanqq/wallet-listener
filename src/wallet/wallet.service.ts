import { Injectable } from '@nestjs/common';
import { getApiConfiguration } from './wallet.utils';
import { PrismaService } from './prisma.service';
import { DepositAddress } from './types/database';
import { WithdrawBody } from './wallet.model';
import { OkxDepositService } from 'okx-api-connect/services/depositService';
import { OkxWithdrawalService } from 'okx-api-connect/services/withdrawalService';
import { WithdrawalDestinationType } from 'okx-api-connect/types/enums';

@Injectable()
export class WalletService extends PrismaService {
  // get all deposit addresses fro given currency
  public async depositAll(ccy: string) {
    const okx = new OkxDepositService(getApiConfiguration());

    const addresses = await okx.getDepositAddress({ ccy });

    if (addresses.code !== '0') return addresses;

    const filteredAddresses = addresses.data.filter(
      (address) => address.selected,
    );

    return await this.updateDepositAddresses(
      filteredAddresses as DepositAddress[],
    );
  }

  // get deposit address by chain
  public async depositChain(chain: string) {
    const okx = new OkxDepositService(getApiConfiguration());

    // get deposit address from db
    const address = await this.getDepositAddressByChain(chain);

    if (address.status !== 200)
      return {
        status: 400,
        code: '0',
        message: 'Deposit address not found',
      };

    const okxAddress = await okx.getDepositAddress({ ccy: address.data.ccy });

    if (okxAddress.code !== '0') return okxAddress;

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

  // make withdraw
  public async withdraw(body: WithdrawBody) {
    const okx = new OkxWithdrawalService(getApiConfiguration());

    const okxWithdraw = await okx.postWithdrawal({
      amt: body.amount,
      fee: body.fee,
      dest: WithdrawalDestinationType.on_chain,
      ccy: body.ccy,
      chain: body.chain,
      toAddr: body.toAddress,
    });

    return okxWithdraw;
  }
}
