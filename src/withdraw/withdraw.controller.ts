import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, CustomRequest } from './types/apiTypes';
import { WithdrawBody } from './withdraw.model';
import { PostWithdrawalResponse } from 'okx-api-connect/types/responses';
import { WithdrawService } from './withdraw.service';

@Controller('/api/withdraw')
export class WithdrawController {
  constructor(private readonly service: WithdrawService) {}

  @Post()
  async withdraw(
    @Body() body: WithdrawBody,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    const withdraw: ApiResponse<PostWithdrawalResponse[] | undefined> =
      await this.service.withdraw(body, req.apiConfiguration, req.session);

    return res.status(withdraw.status).json(withdraw);
  }
}
