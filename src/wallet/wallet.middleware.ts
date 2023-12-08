import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WalletMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // unauth error
    if (!req.headers.authorization) {
      res.status(401).json({
        status: '401',
        message: 'Authorized require.',
      });
      return;
    }

    //getting users keys

    next();
  }
}
