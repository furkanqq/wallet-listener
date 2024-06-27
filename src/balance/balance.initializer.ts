import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Moralis from 'moralis';
import { GetDepositAddressResponse } from 'src/deposit/deposit.abstract';
import { Balance } from 'src/schema/balance.schema';
import { DepositAddress } from 'src/schema/deposit.schema';
import { Address } from 'viem';

@Injectable()
export class BalanceInitializer implements OnModuleInit {
  constructor(
    @InjectModel(DepositAddress.name)
    private depositModel: Model<DepositAddress>,
    @InjectModel(Balance.name)
    private balanceModel: Model<Balance>,
  ) {
    this.depositModel = depositModel;
    this.balanceModel = balanceModel;
  }

  async onModuleInit(): Promise<void> {}

  //   async onModuleInit(): Promise<void> {
  //     await this.getStartingBalance();
  //   }

  //   async getStartingBalance(): Promise<void> {
  //     try {
  //       const depositAddresses = await this.depositModel.find();
  //       const addressArray = await this.uniqueAddresses(depositAddresses);

  //       const chains = ['0x1', '0x38', '0x89', '0xfa', '0xa4b1', '0xa'];

  //       await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  //       // Throttling with delay
  //       for (const address of addressArray) {
  //         for (const chain of chains) {
  //           await this.retry(async () => {
  //             await this.updateBalanceForAddressAndChain(address, chain);
  //           }, 3);
  //           await this.delay(200); // 200ms delay between each request
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Error in getStartingBalance:', err);
  //     }
  //   }

  //   private async retry(fn: () => Promise<void>, retries: number): Promise<void> {
  //     for (let i = 0; i < retries; i++) {
  //       try {
  //         await fn();
  //         return;
  //       } catch (err) {
  //         if (i === retries - 1) {
  //           throw err;
  //         }
  //         const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
  //         await this.delay(waitTime); // wait before retrying
  //       }
  //     }
  //   }

  //   private delay(ms: number): Promise<void> {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  //   private async updateBalanceForAddressAndChain(
  //     address: addressArrayType,
  //     chain: string,
  //   ): Promise<void> {
  //     try {
  //       const result = await Moralis.EvmApi.token.getWalletTokenBalances({
  //         chain: chain,
  //         address: address.addr as Address,
  //       });

  //       await Promise.all(
  //         result.raw.map(async (token) => {
  //           await this.updateBalance(
  //             address.id as number,
  //             token.symbol,
  //             token.balance,
  //           );
  //         }),
  //       );
  //     } catch (err) {
  //       console.error(
  //         `Error fetching balance for address ${address.addr} on chain ${chain}:`,
  //         err,
  //       );
  //     }
  //   }

  //   private async updateBalance(
  //     customerId: number,
  //     ccy: string,
  //     balanceValue: string,
  //   ): Promise<void> {
  //     const balance = {
  //       ccy,
  //       customerId,
  //       balance: balanceValue,
  //       availableBalance: balanceValue, //availableBalance ileride değişecek. şimdilik balance ile aynı
  //       frozenBalance: '0', //frozenBalance ileride değişecek. şimdilik 0
  //     };

  //     const existingBalance = await this.balanceModel.findOne({
  //       customerId,
  //       ccy,
  //     });

  //     if (existingBalance) {
  //       await this.balanceModel.updateOne(
  //         { customerId, ccy },
  //         { balance: balanceValue },
  //       );
  //     } else {
  //       await this.balanceModel.create(balance);
  //     }
  //   }

  //   private async uniqueAddresses(
  //     objects: GetDepositAddressResponse[],
  //   ): Promise<addressArrayType[]> {
  //     let addressArray = [];
  //     let addressSet = new Set();

  //     objects.forEach((obj) => {
  //       if (obj.addr) {
  //         if (!addressSet.has(obj.addr)) {
  //           addressSet.add(obj.addr);
  //           addressArray.push({
  //             addr: obj.addr,
  //             ccy: obj.ccy,
  //             id: obj.customerId,
  //           });
  //         }
  //       }
  //     });

  //     return addressArray;
  //   }
  // }

  // interface addressArrayType {
  //   addr: Address;
  //   ccy: string;
  //   id: number;
  // }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // async getStartingBalance(): Promise<void> {
  //   const depositAddress = await this.depositModel.find();
  //   const addressArray = await this.uniqueAddresses(depositAddress);
  //   let balance = new Balance();

  //   // ethereum - binance - polygon - fantom - arbitrum - optimism
  //   const chains = ['0x1', '0x38', '0x89', '0xfa', '0xa4b1', '0xa'];

  //   await Moralis.start({
  //     apiKey: process.env.MORALIS_API_KEY,
  //   });

  //   for (const address of addressArray) {
  //     for (const chain of chains) {
  //       try {
  //         const result = await Moralis.EvmApi.token.getWalletTokenBalances({
  //           chain: chain,
  //           address: address.addr as Address,
  //         });
  //         for (const raw of result.raw) {
  //           balance.ccy = raw.symbol;
  //           balance.customerId = address.id as number;
  //           balance.balance = raw.balance;
  //           balance.availableBalance = raw.balance;
  //           balance.frozenBalance = '0';

  //           const findBalance = await this.balanceModel.findOne({
  //             customerId: address.id as number,
  //             ccy: raw.symbol,
  //           });

  //           if (!findBalance) {
  //             await this.balanceModel.create(balance);
  //           } else {
  //             await this.balanceModel.updateOne(
  //               {
  //                 customerId: address.id as number,
  //                 ccy: raw.symbol,
  //               },
  //               {
  //                 balance: raw.balance,
  //               },
  //             );
  //           }
  //         }
  //       } catch (err) {
  //         console.log(err, 'err');
  //       }
  //     }
}
