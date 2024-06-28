import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { publicClient } from 'src/client';
import { Balance } from 'src/schema/balance.schema';
import { Coin } from 'src/schema/coin.schema';
import { DepositAddress } from 'src/schema/deposit.schema';
import { DepositHistory } from 'src/schema/depositHistory.schema';
import { Address, erc20Abi, formatUnits, parseAbiItem, parseUnits } from 'viem';

@Injectable()
export class DepositInitializer implements OnModuleInit {
  constructor(
    @InjectModel(Coin.name)
    private coinModel: Model<Coin>,
    @InjectModel(DepositAddress.name)
    private depositModel: Model<DepositAddress>,
    @InjectModel(Balance.name)
    private balanceModel: Model<Balance>,
    @InjectModel(DepositHistory.name)
    private depositHistoryModel: Model<DepositHistory>,
  ) {
    this.coinModel = coinModel;
    this.depositModel = depositModel;
    this.balanceModel = balanceModel;
  }

  async onModuleInit(): Promise<void> {
    await this.coinListener();
  }

  async coinListener(): Promise<void> {
    const coins = await this.coinModel.find({
      active: true,
    });

    const addresses = await this.depositModel
      .find({}, { addr: 1, customerId: 1, _id: 0 })
      .exec();

    if (!coins.length) {
      return;
    }

    for (const coin of coins) {
      const addrArray = addresses.map((address) => address.addr);

      const uniqueAddrArray = [...new Set(addrArray)];

      for (const client of publicClient) {
        client.watchEvent({
          address: coin.address as Address,
          event: parseAbiItem(
            'event Transfer(address indexed from, address indexed to, uint256 value)',
          ),
          args: {
            to: uniqueAddrArray as Address[],
          },
          onLogs: (logs) => {
            logs.map(async (log) => {
              const to = log.args.to;
              const value = formatUnits(log.args.value, 18);

              const deposit = await this.depositModel.findOne({
                addr: to,
              });

              if (!deposit) {
                return;
              }

              const balance = await this.balanceModel.findOne({
                customerId: deposit.customerId,
                ccy: coin.ccy,
              });
              if (!balance) {
                const balance = {
                  ccy: coin.ccy,
                  customerId: deposit.customerId,
                  balance: parseUnits(value, 18),
                  availableBalance: parseUnits(value, 18),
                  frozenBalance: '0',
                };
                await this.balanceModel.create(balance);
              } else {
                balance.balance = parseUnits(
                  (
                    Number(balance.balance) / 10 ** 18 +
                    parseFloat(value)
                  ).toString(),
                  18,
                ).toString();
                balance.availableBalance = parseUnits(
                  (
                    Number(balance.availableBalance) / 10 ** 18 +
                    parseFloat(value)
                  ).toString(),
                  18,
                ).toString();
                await balance.save();
              }

              const history = {
                customerId: deposit.customerId,
                chain: coin.chain,
                tokenAddress: coin.address,
                toAddr: to,
                amount: value,
                network: client.chain.name,
                blockNumber: log.blockNumber,
                txHash: log.transactionHash,
              };
              await this.depositHistoryModel.create(history);
            });
          },
        });
      }
    }
  }
}
