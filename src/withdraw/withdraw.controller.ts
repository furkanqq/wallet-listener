import { Body, Controller, Post, Res } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { Response } from 'express';
import { WithdrawBody } from './withdraw.model';
import { ApiResponse } from './types/apiTypes';
import { DepositAddress } from 'src/deposit/types/okxResponse';

@Controller('/api/withdraw/')
export class WithdrawController {
  constructor(private readonly service: WithdrawService) {}

  @Post()
  async withdraw(@Body() body: WithdrawBody, @Res() res: Response) {
    const withdraw: ApiResponse<DepositAddress[] | undefined> =
      await this.service.withdraw(body);

    return res.status(withdraw.status).json(withdraw);
  }
}
