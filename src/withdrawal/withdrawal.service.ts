import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WithdrawalRequest } from '../schema/withdrawal.schema';
import { Model } from 'mongoose';
import { WithdrawRequest } from './withdrawal.model';
import { DepositAddress } from 'src/schema/deposit.schema';
import { Balance } from 'src/schema/balance.schema';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectModel(WithdrawalRequest.name)
    private withdrawalModel: Model<WithdrawalRequest>,
    @InjectModel(Balance.name)
    private balanceModel: Model<Balance>,
  ) {
    this.withdrawalModel = withdrawalModel;
    this.balanceModel = balanceModel;
  }
  _init(): void {}

  async withdraw(body: WithdrawRequest): Promise<void> {
    // const fromAddr = await this.balanceModel.findOne({
    //   customerId: 2,
    //   ccy: body.ccy,
    // });

    // console.log(fromAddr.balance, 'fromAddr.balance');
    // console.log(Number(fromAddr.balance) - Number(body.amount), 'fromAddr');
    // const newbalance = (
    //   (Number(fromAddr.balance) / 10 ** 18 - Number(body.amount)) *
    //   10 ** 18
    // ).toString();

    // await this.balanceModel.updateOne(
    //   { customerId: 2, ccy: body.ccy },
    //   { $set: { balance: newbalance } },
    // );
    // console.log(newbalance, 'newbalance');

    const withdrawal = new this.withdrawalModel({
      customerId: 2,
      subAccount: 'asd',
      amount: body.amount,
      ccy: body.ccy,
      chain: body.chain,
      fee: body.fee,
      toAddr: body.toAddr,
    });

    await this.withdrawalModel.create(withdrawal);
  }
}
