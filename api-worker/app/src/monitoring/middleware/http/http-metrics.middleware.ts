import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpMetrics } from './http.metrics';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
    constructor(
        private readonly httpMetrics: HttpMetrics,
    ) {}

    use(request: Request, response: Response, next: NextFunction) {
        const start = process.hrtime.bigint();
        response.on('finish',
            () => {
                this.httpMetrics.incrementInFlight();
                
                const duration =
                    Number(
                        process.hrtime.bigint() - start,
                    ) / 1e9;

                const route = request.route?.path ??request.path;

                this.httpMetrics.recordRequest(
                    request.method,
                    route,
                    response.statusCode,
                    duration,
                );

                this.httpMetrics.decrementInFlight();
            },
        );
        next();
    }
}