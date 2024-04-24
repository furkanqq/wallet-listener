import { Response } from 'express';
import { CustomError } from './error';

export class CustomResponse {
  successResponse<T>(
    res: Response,
    data: T,
  ): Response<string, Record<string, string | number>> {
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      status: 200,
      message: '',
      data: data,
    });
  }

  errorResponse(
    res: Response,
    error: CustomError,
  ): Response<string, Record<string, string | number>> {
    return res.status(Number(error.httpStatus)).json({
      timestamp: new Date().toISOString(),
      status: error.httpStatus,
      message: error.message,
      code: error.code,
      data: null,
    });
  }
}
