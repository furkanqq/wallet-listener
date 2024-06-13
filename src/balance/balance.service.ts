import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Balance } from 'src/schema/balance.schema';
import { AuthorizedUser } from 'src/utils/abstract';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name)
    private readonly balanceModel: Model<Balance>,
  ) {
    this.balanceModel = balanceModel;
  }
  _init(): void {}

  async customerBalance(user: AuthorizedUser): Promise<Balance> {
    const balance = await this.balanceModel.findOne({
      customerId: user.id,
    });

    return balance;
  }
}
