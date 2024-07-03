import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomResponse } from 'src/utils/api/response';
import { DepositService } from './deposit.service';
import { AuthGuard } from 'src/utils/api/guard';
import { AuthDecorator } from 'src/utils/api/decorator';
import { RedisSession } from 'src/utils/abstract';
import { MultiFactorType } from 'src/utils/enum';
import { VerificationGuard } from 'src/utils/api/verification';
import { GetDepositAddressResponse } from './deposit.abstract';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('api/deposit')
export class DepositController {
  private readonly response: CustomResponse;
  constructor(private readonly depositService: DepositService) {
    depositService._init();
    this.response = new CustomResponse();
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
      .getDepositAddressByChain(chain, session.user)
      .then((depositAddresses) => {
        return this.response.successResponse<GetDepositAddressResponse>(
          res,
          depositAddresses,
        );
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
