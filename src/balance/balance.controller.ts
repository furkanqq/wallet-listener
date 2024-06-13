import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { CustomResponse } from 'src/utils/api/response';
import { BalanceService } from './balance.service';
import { MultiFactorType } from 'src/utils/enum';
import { VerificationGuard } from 'src/utils/api/verification';
import { AuthGuard } from 'src/utils/api/guard';
import { Balance } from 'src/schema/balance.schema';
import { Request, Response } from 'express';
import { AuthDecorator } from 'src/utils/api/decorator';
import { RedisSession } from 'src/utils/abstract';

@Controller('api/balance')
export class BalanceController {
  private readonly response: CustomResponse;
  constructor(private readonly balanceService: BalanceService) {
    balanceService._init();
    this.response = new CustomResponse();
  }

  @Get()
  @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @AuthDecorator() session: RedisSession,
  ): Promise<Response> {
    return await this.balanceService
      .customerBalance(session.user)
      .then((balance) => {
        return this.response.successResponse<Balance>(res, balance);
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
