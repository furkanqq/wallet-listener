import { Injectable } from '@nestjs/common';
import { getApiConfiguration } from './wallet.utils';
import { PrismaService } from './prisma.service';
import { DepositAddress } from './types/database';
import { TransferBody, WithdrawBody } from './wallet.model';
import { OkxDepositService } from 'okx-api-connect/services/depositService';
import { OkxWithdrawalService } from 'okx-api-connect/services/withdrawalService';
import { OkxMarketService } from 'okx-api-connect/services/marketService';
import { OkxWalletService } from 'okx-api-connect/services/walletService';
import {
  AccountType,
  InstrumentType,
  WithdrawalDestinationType,
} from 'okx-api-connect/types/enums';
import { ApiResponse } from './types/apiTypes';

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

  // get user main balance
  public async getMainBalance() {
    const okxWallet = new OkxWalletService(getApiConfiguration());
    const okxMarket = new OkxMarketService(getApiConfiguration());

    // get balance and market tickers
    const { balance, market } = await Promise.all([
      okxWallet.getMainAccountBalance(),
      okxMarket.getMarketTickers({ instType: InstrumentType.SPOT }),
    ]).then(([balance, market]) => {
      return { balance, market };
    });

    // errors
    if (balance.code !== '0') return balance;
    if (market.code !== '0') return market as ApiResponse<undefined>;

    // calculating total balance
    let totalBalance = 0;
    balance.data.map((bal) => {
      if (bal.ccy !== 'USDT') {
        const usdtPrice = market.data.find(
          (m) => m.instId === `${bal.ccy}-USDT`,
        ).last;

        totalBalance += Number(bal.availBal) * Number(usdtPrice);
      } else {
        totalBalance += Number(bal.availBal);
      }
    });

    return {
      status: balance.status,
      code: balance.code,
      message: balance.message,
      data: {
        totalEqual: totalBalance.toString(),
        balanceList: balance.data,
      },
    };
  }

  // get user trading balance
  public async getTradingBalance() {
    const okx = new OkxWalletService(getApiConfiguration());

    const balance = await okx.getTradingAccountBalance();

    if (balance.code !== '0') return balance;

    // extract data from array
    return { ...balance, data: balance.data[0] };
  }

  // transfer
  public async transfer(body: TransferBody) {
    const okx = new OkxWalletService(getApiConfiguration());

    return await okx.fundsTransfer({
      ccy: body.ccy.toUpperCase(),
      amt: body.amount,
      from:
        body.toAccount === 'main' ? AccountType.Trading : AccountType.Funding,
      to: body.toAccount === 'main' ? AccountType.Funding : AccountType.Trading,
    });
  }
}
