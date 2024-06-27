import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomResponse } from 'src/utils/api/response';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawRequest } from './withdrawal.model';
import { VerificationGuard } from 'src/utils/api/verification';
import { MultiFactorType } from 'src/utils/enum';
import { AuthGuard } from 'src/utils/api/guard';

@Controller('api/withdrawal')
export class WithdrawalController {
  private readonly response: CustomResponse;
  constructor(private readonly withdrawalService: WithdrawalService) {
    withdrawalService._init();
    this.response = new CustomResponse();
  }

  // @UseGuards(AuthGuard, new VerificationGuard(MultiFactorType.AUTHENTICATE))
  @Post()
  async withdraw(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: WithdrawRequest,
  ): Promise<Response> {
    return await this.withdrawalService
      .withdraw(body)
      .then((withdraw) => {
        return this.response.successResponse(res, withdraw);
      })
      .catch((err) => {
        return this.response.errorResponse(res, err);
      });
  }
}
