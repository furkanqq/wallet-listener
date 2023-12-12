import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response } from 'express';
import { ApiResponse, CustomRequest } from './types/apiTypes';
import { TransferBody } from './wallet.model';

@Controller('/api/wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('main/balance')
  async mainBalance(@Req() req: CustomRequest, @Res() res: Response) {
    const balance = await this.service.getMainBalance(req.apiConfiguration);
    return res.status(balance.status).json(balance);
  }

  @Get('trading/balance')
  async tradingBalance(@Req() req: CustomRequest, @Res() res: Response) {
    const balance = await this.service.getTradingBalance(req.apiConfiguration);
    return res.status(balance.status).json(balance);
  }

  @Post('transfer')
  async transfer(
    @Body() body: TransferBody,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    if (body.toAccount === 'main' || body.toAccount === 'trading') {
      const transfer: ApiResponse<any | undefined> =
        await this.service.transfer(body, req.apiConfiguration);

      return res.status(transfer.status).json(transfer);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        code: '100-1010',
        message: 'toAccount must be "main" or "trading"',
      });
    }
  }
}
