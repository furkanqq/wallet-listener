import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { Response } from 'express';
import { ApiResponse } from './types/apiTypes';
import { DepositAddress } from './types/okxResponse';

@Controller('/api/deposit/')
export class DepositController {
  constructor(private readonly service: DepositService) {}

  @Get('depositAll/:ccy')
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

    const address: ApiResponse<DepositAddress[]> =
      await this.service.depositAll(ccy);

    return res.status(HttpStatus.OK).json(address);
  }

  @Get('depositAddressByChain/:chain')
  async getDepositChain(
    @Param('chain') chain: string,
    @Res() res: Response<ApiResponse<string | undefined>>,
  ) {
    if (!chain)
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: '0',
        status: 400,
        message: 'chain is required and cannot be empty',
      });

    const address: ApiResponse<string> = await this.service.depositChain(chain);

    return res.status(address.status).json(address);
  }
}
