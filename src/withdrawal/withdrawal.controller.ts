import { Controller } from '@nestjs/common';
import { CustomResponse } from 'src/utils/api/response';
import { WithdrawalService } from './withdrawal.service';

@Controller('api/withdrawal')
export class WithdrawalController {
  private readonly response: CustomResponse;
  constructor(private readonly withdrawalService: WithdrawalService) {
    withdrawalService._init();
    this.response = new CustomResponse();
  }
}
