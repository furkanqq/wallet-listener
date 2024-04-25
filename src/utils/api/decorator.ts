import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RedisService } from 'src/utils/redis';
import { ExceptionMessages } from './exception';
import { SessionType } from '../enum';

export const AuthDecorator = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw ExceptionMessages.InvalidToken;
    }

    const token = req.headers.authorization.split(' ')[1];

    const redisService = new RedisService();
    const redisSession = await redisService.getRedisSession(token);

    if (!redisSession) {
      throw ExceptionMessages.InvalidCredentials;
    }
    if (redisSession.sessionType === SessionType.FORGOT) {
      throw ExceptionMessages.InvalidCredentials;
    }

    return redisSession;
  },
);
