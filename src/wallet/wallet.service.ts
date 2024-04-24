import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ApiConfiguration,
  AuthorizedUser,
  CustomOkxResponse,
} from 'src/utils/abstract';
import { OkxWalletService } from 'okx-api-connect/services/walletService';
import { Wallet } from './wallet.schema';
import {
  FundsTransferResponse,
  GetMainAccountBalanceResponse,
  GetMarketTickersResponse,
  GetTradingAccountBalanceResponse,
} from 'okx-api-connect/types/responses';
import { CustomError } from 'src/utils/api/error';
import { BalanceResponse } from './wallet.abstract';
import { OkxMarketService } from 'okx-api-connect/services/marketService';
import { AccountType, InstrumentType } from 'okx-api-connect/types/enums';
import { TransferRequest } from './wallet.model';
import { WalletType } from './wallet.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
  ) {
    this.walletModel = walletModel;
  }
  _init(): void {}

  async getTradingBalance(
    authorizedUser: AuthorizedUser,
    apiConfiguration: ApiConfiguration,
  ): Promise<BalanceResponse> {
    const tradingBalance = await new OkxWalletService(apiConfiguration)
      .getTradingAccountBalance()
      .then((response: CustomOkxResponse<GetTradingAccountBalanceResponse>) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new CustomError(response.message, response.code, response.status);
      });

    tradingBalance[0].details.map(async (balance) => {
      await this.walletModel.updateOne(
        {
          walletType: WalletType.Trading,
          ccy: balance.ccy,
          customerId: authorizedUser.id,
        },
        {
          customerId: authorizedUser.id,
          subAccount: authorizedUser.subAccount,
          ccy: balance.ccy,
          balance: balance.eq,
          availableBalance: balance.availBal,
          frozenBalance: balance.frozenBal,
          walletType: WalletType.Trading,
        },
        {
          upsert: true,
        },
      );
    });

    return {
      usdtEqual: tradingBalance[0].totalEq,
      balanceList: tradingBalance[0].details,
    };
  }

  async getMainBalance(
    authorizedUser: AuthorizedUser,
    apiConfiguration: ApiConfiguration,
  ): Promise<BalanceResponse> {
    const mainBalance = await new OkxWalletService(apiConfiguration)
      .getMainAccountBalance()
      .then((response: CustomOkxResponse<GetMainAccountBalanceResponse>) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new CustomError(response.message, response.code, response.status);
      });

    mainBalance.map(async (balance) => {
      await this.walletModel.updateOne(
        {
          walletType: WalletType.Main,
          ccy: balance.ccy,
          customerId: authorizedUser.id,
        },
        {
          customerId: authorizedUser.id,
          subAccount: authorizedUser.subAccount,
          ccy: balance.ccy,
          balance: balance.bal,
          availableBalance: balance.availBal,
          frozenBalance: balance.frozenBal,
          walletType: WalletType.Main,
        },
        {
          upsert: true,
        },
      );
    });

    let usdtEqual = 0;

    const tickerPrices = await new OkxMarketService(apiConfiguration)
      .getMarketTickers({ instType: InstrumentType.SPOT })
      .then((response: CustomOkxResponse<GetMarketTickersResponse>) => {
        if (response.status === 200) {
          return response.data;
        }
      });

    for (const balance of mainBalance) {
      if (balance.ccy === 'USDT') {
        usdtEqual += +balance.availBal;
      } else {
        const tickerPrice = tickerPrices.filter((ticker) => {
          return ticker.instId === `${balance.ccy}-USDT`;
        });

        usdtEqual += Number(tickerPrice[0].last) * Number(balance.availBal);
      }
    }

    return {
      usdtEqual: usdtEqual.toFixed(16),
      balanceList: mainBalance,
    };
  }

  async transfer(
    body: TransferRequest,
    apiConfiguration: ApiConfiguration,
  ): Promise<FundsTransferResponse[]> {
    return await new OkxWalletService(apiConfiguration)
      .fundsTransfer({
        ccy: body.ccy.toUpperCase(),
        amt: body.amount,
        from: body.toTrade ? AccountType.Funding : AccountType.Trading,
        to: body.toTrade ? AccountType.Trading : AccountType.Funding,
        type: '0',
      })
      .then((response: CustomOkxResponse<FundsTransferResponse>) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new CustomError(response.message, response.code, response.status);
      });
  }
}
