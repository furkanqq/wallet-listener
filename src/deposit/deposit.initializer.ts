import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { publicClient } from 'src/client';
import { Balance } from 'src/schema/balance.schema';
import { Coin } from 'src/schema/coin.schema';
import { DepositAddress } from 'src/schema/deposit.schema';
import { DepositHistory } from 'src/schema/depositHistory.schema';
import { TransferObject } from 'src/utils/abstract';
import {
  Address,
  decodeEventLog,
  erc20Abi,
  formatUnits,
  parseAbiItem,
  parseUnits,
} from 'viem';
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
    await this.nativeListener();
    await this.coinListener();
  }

  async nativeListener(): Promise<void> {
    const depositAddresses = [
      '0x2147409d92c7862e2b031afbf94336f43296847e', // ahmetin account
    ];

    const tokenAddresses = [
      '0x7f3a4c6817aedbb79a6d9effa5dfa9a0f1f44622', // elt token
      '0x883138d67cefb848c2aa41b9ddf5ae96f3773db7', // oct458 token
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // wbnb,
      '0xa1d641d0da02d360dd5967ee2433533c3993ea12', // mrk token mainnet
    ];

    // for (const client of publicClient) {
    const client = publicClient[1];

    client.watchBlocks({
      onBlock: (block) => {
        block.transactions.map(async (hash) => {
          try {
            const transaction = await client.waitForTransactionReceipt({
              hash,
            });

            // native tokens
            if (
              depositAddresses.includes(transaction.to.toLowerCase()) &&
              transaction.logs.length === 0
            ) {
              const nativeTransaction = await client.getTransaction({
                hash: transaction.transactionHash,
              });

              const object: TransferObject = {
                transactionHash: nativeTransaction.hash,
                blockNumber: nativeTransaction.blockNumber,
                from: nativeTransaction.from,
                to: nativeTransaction.to,
                value: nativeTransaction.value.toString(),
                tokenAddress: '0x',
              };

              console.log(object);

              return;
            }

            const topics = transaction.logs.map((log: any) => {
              const decoded = decodeEventLog({
                abi: erc20Abi,
                data: log.data,
                topics: log.topics,
              });

              return decoded as any;
            });

            // erc20 tokens
            if (
              topics[0].eventName === 'Transfer' &&
              topics[0].args.value !== 0n &&
              tokenAddresses.includes(transaction.to.toLowerCase()) &&
              depositAddresses.includes(topics[0].args.to.toLowerCase())
            ) {
              const transferObject: TransferObject = {
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber,
                from: topics[0].args.from,
                to: topics[0].args.to,
                value: topics[0].args.value.toString(),
                tokenAddress: transaction.to,
              };

              console.log(transferObject);

              return;
            }
          } catch (error) {}
        });
      },
    });
    // }
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
              console.log('first');
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
