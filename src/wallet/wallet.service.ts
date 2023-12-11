import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransferBody } from './wallet.model';
import { OkxMarketService } from 'okx-api-connect/services/marketService';
import { OkxWalletService } from 'okx-api-connect/services/walletService';
import { AccountType, InstrumentType } from 'okx-api-connect/types/enums';
import { ApiConfiguration, ApiResponse } from './types/apiTypes';

@Injectable()
export class WalletService extends PrismaService {
  // get user main balance
  public async getMainBalance(apiConfiguration: ApiConfiguration) {
    const okxWallet = new OkxWalletService(apiConfiguration);
    const okxMarket = new OkxMarketService(apiConfiguration);

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
  public async getTradingBalance(apiConfiguration: ApiConfiguration) {
    const okx = new OkxWalletService(apiConfiguration);

    const balance = await okx.getTradingAccountBalance();

    if (balance.code !== '0') return balance;

    // extract data from array
    return { ...balance, data: balance.data[0] };
  }

  // transfer
  public async transfer(
    body: TransferBody,
    apiConfiguration: ApiConfiguration,
  ) {
    const okx = new OkxWalletService(apiConfiguration);

    return await okx.fundsTransfer({
      ccy: body.ccy.toUpperCase(),
      amt: body.amount,
      from:
        body.toAccount === 'main' ? AccountType.Trading : AccountType.Funding,
      to: body.toAccount === 'main' ? AccountType.Funding : AccountType.Trading,
    });
  }
}
