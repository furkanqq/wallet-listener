import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
  code: string;
  httpStatus: HttpStatus;

  constructor(message: string, code: string, httpStatus: HttpStatus) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}
