import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomResponse } from 'src/utils/api/response';
import { AuthGuard } from 'src/utils/api/guard';
import { AuthDecorator } from 'src/utils/api/decorator';
import { RedisSession } from 'src/utils/abstract';
import { WalletService } from './wallet.service';
import { TransferRequest } from './wallet.model';
import { VerificationGuard } from 'src/utils/api/verification';
import { MultiFactorType } from 'src/utils/enum';

@Controller('api/wallet')
export class WalletController {
  private readonly response: CustomResponse;
  constructor(private readonly walletService: WalletService) {
    walletService._init();
    this.response = new CustomResponse();
  }

  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Get('trading/balance')
  async getTradingBalance(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.walletService
      .getTradingBalance(session.user, session.apiConfiguration)
      .then((balance) => {
        return this.response.successResponse(res, balance);
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }

  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Get('main/balance')
  async getMainBalance(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.walletService
      .getMainBalance(session.user, session.apiConfiguration)
      .then((balance) => {
        return this.response.successResponse(res, balance);
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }

  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Post('transfer')
  async transfer(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: TransferRequest,
  ): Promise<Response> {
    return await this.walletService
      .transfer(body, session.apiConfiguration)
      .then((response) => {
        return this.response.successResponse(res, response);
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
