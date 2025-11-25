import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../../../../application/errors/AppError';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = undefined;

    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
      details = exception.details;
    } else if (exception?.status) {
      statusCode = exception.status;
      message = exception.message || 'Error';
      details = exception.response?.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
