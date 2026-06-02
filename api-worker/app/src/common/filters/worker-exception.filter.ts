import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class WorkerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('WORKER_ERROR_SHIELD');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException 
      ? exception.message 
      : 'Internal Gateway Error';

    this.logger.error(
      `[CRITICAL] Error on path: ${request.originalUrl} - Status: ${status} - Details: ${exception.message || exception}`,
      exception.stack
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      error: {
        message: message,
        type: exception.name || 'UnknownSystemException'
      }
    });
  }
}