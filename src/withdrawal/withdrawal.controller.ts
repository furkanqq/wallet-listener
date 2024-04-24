import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomResponse } from 'src/utils/api/response';
import { WithdrawalService } from './withdrawal.service';
import { AuthGuard } from 'src/utils/api/guard';
import { AuthDecorator } from 'src/utils/api/decorator';
import { WithdrawRequest } from './withdrawal.model';
import { RedisSession } from 'src/utils/abstract';

@Controller('api/withdrawal')
export class WithdrawalController {
  private readonly response: CustomResponse;
  constructor(private readonly withdrawalService: WithdrawalService) {
    withdrawalService._init();
    this.response = new CustomResponse();
  }
  @UseGuards(AuthGuard)
  @Post()
  async withdraw(
    @AuthDecorator() session: RedisSession,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: WithdrawRequest,
  ): Promise<Response> {
    return await this.withdrawalService
      .withdraw(body, session.user, session.apiConfiguration)
      .then((withdrawRequest) => {
        return this.response.successResponse<WithdrawRequest>(
          res,
          withdrawRequest,
        );
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
