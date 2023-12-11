import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { ApiConfiguration } from './wallet/types/apiTypes';
import { Session } from './withdraw/types/apiTypes';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // unauth error
    if (!req.headers.authorization)
      return res.status(401).json({
        status: '401',
        code: '0',
        message: 'Authorized require.',
      });

    const token = req.headers.authorization.split(' ')[1];

    // connection redis and get user api keys
    const client: ReturnType<typeof createClient> = createClient({
      url: process.env.REDIS_URI || '',
    });

    client.connect();

    const userApis: { apis: ApiConfiguration; session: Session } = await client
      .sMembers('redis_session')
      .then(async (res) => {
        if (!res) return undefined;

        const req = res.filter((item) => item === token);

        if (!req || req.length === 0) return undefined;

        return await client.hGetAll('redis_session:' + token).then((res) => {
          return {
            apis: JSON.parse(res.apiConfiguration),
            session: JSON.parse(res.user),
          };
        });
      });

    req['apiConfiguration'] = userApis.apis;
    req['session'] = userApis.session;

    if (!userApis)
      return res.status(401).json({
        status: '401',
        message: 'Wrong user token',
      });

    next();
  }
}
