import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DepositAddress } from './deposit.schema';
import { Model } from 'mongoose';
import { OkxDepositService } from 'okx-api-connect/services/depositService';
import {
  ApiConfiguration,
  AuthorizedUser,
  CustomOkxResponse,
} from 'src/utils/abstract';
import { GetDepositAddressResponse } from 'okx-api-connect/types/responses';
import { CustomError } from 'src/utils/api/error';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel(DepositAddress.name)
    private depositModel: Model<DepositAddress>,
  ) {
    this.depositModel = depositModel;
  }
  _init(): void {}

  async getDepositAddressByCcy(
    ccy: string,
    authorizedUser: AuthorizedUser,
    apiConfiguration: ApiConfiguration,
  ): Promise<DepositAddress[]> {
    this.addDepositAddresses(ccy, authorizedUser, apiConfiguration);

    return await this.depositModel.find({
      subAccount: authorizedUser.subAccount,
      ccy: ccy,
      selected: true,
    });
  }

  async getDepositAddressByChain(
    chain: string,
    authorizedUser: AuthorizedUser,
    apiConfiguration: ApiConfiguration,
  ): Promise<DepositAddress[]> {
    this.addDepositAddresses(
      chain.split('-')[0],
      authorizedUser,
      apiConfiguration,
    );

    return await this.depositModel.find({
      subAccount: authorizedUser.subAccount,
      chain: chain,
      selected: true,
    });
  }

  private async addDepositAddresses(
    ccy: string,
    authorizedUser: AuthorizedUser,
    apiConfiguration: ApiConfiguration,
  ): Promise<void> {
    const okxAddresses: GetDepositAddressResponse[] =
      await new OkxDepositService(apiConfiguration)
        .getDepositAddress({
          ccy: ccy,
        })
        .then((response: CustomOkxResponse<GetDepositAddressResponse>) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new CustomError(
            response.message,
            response.code,
            response.status,
          );
        });

    await Promise.all(
      okxAddresses.map(async (address) => {
        const depositAddress = await this.depositModel.findOne({
          subAccount: authorizedUser.subAccount,
          chain: address.chain,
          addr: address.addr,
        });
        if (!depositAddress) {
          await this.depositModel.create({
            subAccount: authorizedUser.subAccount,
            customerId: authorizedUser.id,
            ...address,
          });
        }
      }),
    );
  }
}
