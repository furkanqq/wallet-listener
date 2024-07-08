import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { publicClient } from 'src/client';
import { Balance } from 'src/schema/balance.schema';
import { Coin } from 'src/schema/coin.schema';
import { DepositAddress } from 'src/schema/deposit.schema';
import { DepositHistory } from 'src/schema/depositHistory.schema';
import { TransferObject } from 'src/utils/abstract';
import { RedisService } from 'src/utils/redis';
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
    // await this.coinListener();
    // await this.coinRedis();
  }

  // async coinRedis(): Promise<void> {
  //   const coins = await this.coinModel.find({
  //     active: true,
  //   });

  //   const redisService = new RedisService();

  //   for (const coin of coins) {
  //     await redisService.addCoinAddressToRedis({
  //       _id: coin._id,
  //       address: coin.address,
  //     });
  //   }
  // }

  async nativeListener(): Promise<void> {
    const depositAddresses = [
      '0x2147409d92c7862e2b031afbf94336f43296847e', // ahmetin account
    ]; // redisten cekilecek redise bir sey kayit etmedim su an

    const redisService = new RedisService();

    // for (const client of publicClient) {
    const client = publicClient[1];

    client.watchBlocks({
      onBlock: async (block) => {
        const tokenAddresses = await redisService.getAllCoinAddressFromRedis();

        block.transactions.map(async (hash) => {
          try {
            const transaction = await client.waitForTransactionReceipt({
              hash,
            });
            // native tokens
            if (
              depositAddresses.includes(transaction.to.toLowerCase()) &&
              transaction.logs.length < 1
            ) {
              console.log('first');
              const nativeTransaction = await client.getTransaction({
                hash: transaction.transactionHash,
              });

              const history: TransferObject = {
                transactionHash: nativeTransaction.hash,
                blockNumber: nativeTransaction.blockNumber,
                from: nativeTransaction.from,
                to: nativeTransaction.to,
                value: nativeTransaction.value.toString(),
                tokenAddress: '0x',
                network: client.chain.name,
                chain:
                  client.chain.nativeCurrency.name + '-' + client.chain.name,
              };

              return await this.depositHistoryModel.create(history);
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
              tokenAddresses.some(
                (token) =>
                  token.address.toLowerCase() === transaction.to.toLowerCase(),
              ) &&
              depositAddresses.includes(topics[0].args.to.toLowerCase())
            ) {
              const chain = tokenAddresses.find(
                (token) =>
                  token.address.toLowerCase() === transaction.to.toLowerCase(),
              );

              const history: TransferObject = {
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber,
                from: topics[0].args.from,
                to: topics[0].args.to,
                value: topics[0].args.value.toString(),
                tokenAddress: transaction.to,
                network: client.chain.name,
                chain: chain._id,
              };

              return await this.depositHistoryModel.create(history);
            }
          } catch (error) {}
        });
      },
    });
    // }
  }

  // async coinListener(): Promise<void> {
  //   const coins = await this.coinModel.find({
  //     active: true,
  //   });

  //   const addresses = await this.depositModel
  //     .find({}, { addr: 1, customerId: 1, _id: 0 })
  //     .exec();

  //   if (!coins.length) {
  //     return;
  //   }

  //   for (const coin of coins) {
  //     const addrArray = addresses.map((address) => address.addr);

  //     const uniqueAddrArray = [...new Set(addrArray)];

  //     for (const client of publicClient) {
  //       client.watchEvent({
  //         address: coin.address as Address,
  //         event: parseAbiItem(
  //           'event Transfer(address indexed from, address indexed to, uint256 value)',
  //         ),
  //         args: {
  //           to: uniqueAddrArray as Address[],
  //         },
  //         onLogs: (logs) => {
  //           logs.map(async (log) => {
  //             console.log('first');
  //             const to = log.args.to;
  //             const value = formatUnits(log.args.value, 18);

  //             const deposit = await this.depositModel.findOne({
  //               addr: to,
  //             });

  //             if (!deposit) {
  //               return;
  //             }

  //             const balance = await this.balanceModel.findOne({
  //               customerId: deposit.customerId,
  //               ccy: coin.ccy,
  //             });
  //             if (!balance) {
  //               const balance = {
  //                 ccy: coin.ccy,
  //                 customerId: deposit.customerId,
  //                 balance: parseUnits(value, 18),
  //                 availableBalance: parseUnits(value, 18),
  //                 frozenBalance: '0',
  //               };
  //               await this.balanceModel.create(balance);
  //             } else {
  //               balance.balance = parseUnits(
  //                 (
  //                   Number(balance.balance) / 10 ** 18 +
  //                   parseFloat(value)
  //                 ).toString(),
  //                 18,
  //               ).toString();
  //               balance.availableBalance = parseUnits(
  //                 (
  //                   Number(balance.availableBalance) / 10 ** 18 +
  //                   parseFloat(value)
  //                 ).toString(),
  //                 18,
  //               ).toString();
  //               await balance.save();
  //             }

  //             const history = {
  //               chain: coin.chain,
  //               tokenAddress: coin.address,
  //               toAddr: to,
  //               amount: value,
  //               network: client.chain.name,
  //               blockNumber: log.blockNumber,
  //               transactionHash: log.transactionHash,
  //             };
  //             await this.depositHistoryModel.create(history);
  //           });
  //         },
  //       });
  //     }
  //   }
  // }
}
