import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomError } from './utils/api/error';
import { ValidationError } from './utils/abstract';

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
  catch(
    exception: Error,
    host: ArgumentsHost,
  ): Response<string, Record<string, string | number>> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof CustomError
          ? exception.httpStatus
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const code = exception instanceof CustomError ? exception.code : null;

    switch (exception.name) {
      case 'CustomError':
        return res.status(status).json({
          timestamp: new Date().toISOString(),
          status: status,
          message: exception.message,
          code: code,
          data: null,
        });

      case 'NotFoundException':
        return res.status(status).json({
          timestamp: new Date().toISOString(),
          status: status,
          message: exception.message,
          code: '100-1400',
          data: null,
        });

      case 'BadRequest':
        return res.status(status).json({
          timestamp: new Date().toISOString(),
          status: status,
          message: exception.message,
          code: '100-1401',
          data: null,
        });

      case 'RangeError':
        return res.status(status).json({
          timestamp: new Date().toISOString(),
          status: status,
          message: exception.message,
          code: '100-1402',
          data: null,
        });

      case 'BadRequestException': {
        const validationError: ValidationError = JSON.parse(
          JSON.stringify(exception),
        );

        return res.status(status).json({
          timestamp: new Date().toISOString(),
          status: status,
          message: validationError.response.message,
          code: '100-1403',
          data: null,
        });
      }

      default:
        return res.status(500).json({
          timestamp: new Date().toISOString(),
          status: 500,
          message: 'Backend Error',
          code: '100-1500',
          data: null,
        });
    }
  }
}
