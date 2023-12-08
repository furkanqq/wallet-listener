import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response } from 'express';
import { ApiResponse } from './types/apiTypes';
import { DepositAddress } from './types/database';
import { WithdrawBody } from './wallet.model';
import {
  GetDepositAddressResponse,
  PostWithdrawalResponse,
} from 'okx-api-connect/types/responses';

@Controller('/api/wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('deposit-all/:ccy')
  async getDepositAll(
    @Param('ccy') ccy: string,
    @Res() res: Response<ApiResponse<DepositAddress[]>>,
  ) {
    if (!ccy)
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: '0',
        status: 400,
        message: 'ccy is required and cannot be empty',
      });

    const address: ApiResponse<DepositAddress[] | GetDepositAddressResponse[]> =
      await this.service.depositAll(ccy);

    return res
      .status(HttpStatus.OK)
      .json(address as ApiResponse<DepositAddress[]>);
  }

  @Get('deposit-address-by-chain/:chain')
  async getDepositChain(
    @Param('chain') chain: string,
    @Res()
    res: Response<ApiResponse<DepositAddress | undefined>>,
  ) {
    if (!chain)
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: '0',
        status: 400,
        message: 'chain is required and cannot be empty',
      });

    const address = await this.service.depositChain(chain);

    return res
      .status(address.status)
      .json(address as ApiResponse<DepositAddress>);
  }

  @Post('withdraw')
  async withdraw(@Body() body: WithdrawBody, @Res() res: Response) {
    const withdraw: ApiResponse<PostWithdrawalResponse[] | undefined> =
      await this.service.withdraw(body);

    return res.status(withdraw.status).json(withdraw);
  }
}
