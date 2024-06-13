import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WithdrawalRequest } from '../schema/withdrawal.schema';
import { Model } from 'mongoose';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectModel(WithdrawalRequest.name)
    private withdrawalModel: Model<WithdrawalRequest>,
  ) {
    this.withdrawalModel = withdrawalModel;
  }
  _init(): void {}
}
