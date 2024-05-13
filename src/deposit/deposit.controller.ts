import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomResponse } from 'src/utils/api/response';
import { DepositService } from './deposit.service';
import { AuthGuard } from 'src/utils/api/guard';
import { AuthDecorator } from 'src/utils/api/decorator';
import { RedisSession } from 'src/utils/abstract';
import { DepositAddress } from './deposit.schema';
import { MultiFactorType } from 'src/utils/enum';
import { VerificationGuard } from 'src/utils/api/verification';

@Controller('api/deposit')
export class DepositController {
  private readonly response: CustomResponse;
  constructor(private readonly depositService: DepositService) {
    depositService._init();
    this.response = new CustomResponse();
  }

  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Get(':ccy')
  async getDepositAddressByCcy(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
    @Param('ccy') ccy: string,
  ): Promise<Response> {
    return await this.depositService
      .getDepositAddressByCcy(ccy, session.user, session.apiConfiguration)
      .then((depositAddresses) => {
        return this.response.successResponse<DepositAddress[]>(
          res,
          depositAddresses,
        );
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }

  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Get('chain/:chain')
  async getDepositAddressByChain(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
    @Param('chain') chain: string,
  ): Promise<Response> {
    return await this.depositService
      .getDepositAddressByChain(chain, session.user, session.apiConfiguration)
      .then((depositAddresses) => {
        return this.response.successResponse<DepositAddress[]>(
          res,
          depositAddresses,
        );
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
