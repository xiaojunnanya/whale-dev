import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// 对于HttpException的异常捕获
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';
    errorMessage = typeof errorMessage === 'string' ? errorMessage : (errorMessage as { message: string}).message;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toString(),
      path: request.url,
      message: 'error',
      data: errorMessage
    };

    response.status(status).json(errorResponse);
  }
}