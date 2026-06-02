import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as express from 'express';

@Injectable()
export class GatewayLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GATEWAY_TRAFFIC');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<express.Request>();
    const response = httpContext.getResponse<express.Response>();

    const startTime = process.hrtime();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const diff = process.hrtime(startTime);
          const durationInMs = (diff[0] * 1000 + diff[1] / 1000000).toFixed(2);

          const logPayload = {
            timestamp: new Date().toISOString(),
            tenantId: request.headers['x-tenant-id'] || 'anonymous',
            method: request.method,
            path: request.originalUrl,
            clientIp: request.headers['x-real-ip'] || request.ip,
            statusCode: response.statusCode,
            latencyMs: parseFloat(durationInMs),
          };
          this.logger.log(`GATEWAY INFO: ${JSON.stringify(logPayload)}`);
        },
        error: (err) => {
          const diff = process.hrtime(startTime);
          const durationInMs = (diff[0] * 1000 + diff[1] / 1000000).toFixed(2);
          const logPayload = {
            timestamp: new Date().toISOString(),
            path: request.originalUrl,
            errorMessage: err.message,
            latencyMs: parseFloat(durationInMs),
          }
          this.logger.error(`GATEWAY ERROR: ${JSON.stringify(logPayload)}`);
        },
      }),
    );
  }
}