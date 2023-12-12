import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, CustomRequest } from './types/apiTypes';
import { GetDepositAddressResponse } from 'okx-api-connect/types/responses';
import { DepositService } from './deposit.service';

@Controller('/api/deposit')
export class DepositController {
  constructor(private readonly service: DepositService) {}

  @Get('all/:ccy')
  async getDepositAll(
    @Param('ccy') ccy: string,
    @Req() req: CustomRequest,
    @Res() res: Response<ApiResponse<GetDepositAddressResponse[] | undefined>>,
  ) {
    if (!ccy)
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        code: '100-1010',
        message: 'ccy is required and cannot be empty',
      });

    const address: ApiResponse<GetDepositAddressResponse[]> =
      await this.service.depositAll(ccy, req.apiConfiguration);

    return res.status(HttpStatus.OK).json(address);
  }

  @Get('chain/:chain')
  async getDepositChain(
    @Param('chain') chain: string,
    @Req() req: CustomRequest,
    @Res()
    res: Response<ApiResponse<GetDepositAddressResponse | undefined>>,
  ) {
    if (!chain)
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        code: '100-1000',
        message: 'chain is required and cannot be empty',
      });

    const address = await this.service.depositChain(
      chain,
      req.apiConfiguration,
    );

    return res.status(address.status).json(address);
  }
}
