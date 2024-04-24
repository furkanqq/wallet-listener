import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from './error';

export interface ExceptionMessage {
  httpStatus: HttpStatus;
  message: string;
  code: string;
}

@Injectable()
export class ExceptionMessages {
  static readonly InvalidCredentials: ExceptionMessage = new CustomError(
    'Invalid Credentials!',
    '100-1000',
    HttpStatus.UNAUTHORIZED,
  );

  static readonly InvalidToken: ExceptionMessage = new CustomError(
    'Invalid Token!',
    '100-1001',
    HttpStatus.FORBIDDEN,
  );
}
