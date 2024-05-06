import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisService } from '../redis';
import { MultiFactorType } from '../enum';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(private readonly multiFactorType: MultiFactorType) {
    this.multiFactorType = multiFactorType;
  }
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const token = req.headers.authorization.split(' ')[1];

    const redisService = new RedisService();
    const multiFactorSession = await redisService.getMultiFactorSession(
      token,
      this.multiFactorType,
    );

    if (!multiFactorSession || !multiFactorSession.multiFactorInfo.status) {
      return false;
    }

    return true;
  }
}
