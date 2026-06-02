import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

@Injectable()
export class WorkerLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('WORKER_TRAFFIC');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<AuthenticatedRequest>();
    const response = httpContext.getResponse<Response>();
    
    const startTime = process.hrtime(); 

    return next.handle().pipe(
      tap({
        next: () => {
          const diff = process.hrtime(startTime);
          const durationInMs = (diff[0] * 1000 + diff[1] / 1000000).toFixed(2);

          const logPayload = {
            timestamp: new Date().toISOString(),
            requestId: request.headers['x-request-id'] || 'no-correlation-id',
            tenantId: request.headers['x-tenant-id'] || 'anonymous',
            userId: request.user?.id || 'unauthenticated',
            method: request.method,
            path: request.originalUrl,
            statusCode: response.statusCode,
            executionTimeMs: parseFloat(durationInMs),
          };
          this.logger.log(`Worker Handled Request Successfully: ${JSON.stringify(logPayload)}`);
        },
        error: (err) => {
          const diff = process.hrtime(startTime);
          const durationInMs = (diff[0] * 1000 + diff[1] / 1000000).toFixed(2);

          const errorPayload = {
            timestamp: new Date().toISOString(),
            requestId: request.headers['x-request-id'] || 'no-correlation-id',
            tenantId: request.headers['x-tenant-id'] || 'anonymous',
            userId: request.user?.id || 'unauthenticated',
            method: request.method,
            path: request.originalUrl,
            executionTimeMs: parseFloat(durationInMs),
            errorMessage: err.message,
            errorType: err.name || 'UnknownException',
          };
          this.logger.error(
            `Worker Request Fault Breakdown: ${JSON.stringify(errorPayload)}`, 
            err.stack
          );
        },
      }),
    );
  }
}