import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisService } from '../redis';
import { ExceptionMessages } from './exception';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw ExceptionMessages.InvalidToken;
    }

    const token = req.headers.authorization.split(' ')[1];

    const redisService = new RedisService();
    const isAvailable = await redisService.checkRedisSession(token);

    if (!isAvailable) {
      throw ExceptionMessages.InvalidCredentials;
    }

    return true;
  }
}
