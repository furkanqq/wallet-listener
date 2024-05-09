import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisService } from '../redis';
import { ExceptionMessages } from './exception';
import { AuthenticationType } from '../enum';

@Injectable()
export class KycGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw ExceptionMessages.InvalidToken;
    }

    const token = req.headers.authorization.split(' ')[1];

    const redisService = new RedisService();
    const redisSession = await redisService.getRedisSession(token);

    if (redisSession.user.authenticationType !== AuthenticationType.AUTHORIZED)
      return false;

    return true;
  }
}
