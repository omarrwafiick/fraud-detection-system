import { Injectable } from '@nestjs/common';

import { MetricFactory } from '../../metrics/metric.factory';
import { MetricNames } from '../../metrics/metric.constants';

@Injectable()
export class HttpMetrics {
    private readonly requestCounter =
        MetricFactory.createCounter(
            MetricNames.HTTP_REQUEST_TOTAL,
            'Total HTTP requests',
            [
                'method',
                'route',
                'status',
            ],
        );

    private readonly requestDuration =
        MetricFactory.createHistogram(
            MetricNames.HTTP_REQUEST_DURATION,
            'HTTP request duration',
            [
                'method',
                'route',
                'status',
            ],
        );

    private readonly requestsInFlight =
        MetricFactory.createGauge(
            MetricNames.HTTP_REQUESTS_IN_FLIGHT,
            'Current number of in-flight HTTP requests',
        );
    
    recordRequest(method: string, route: string, status: number, duration: number){
        this.requestCounter.inc({
            method,
            route,
            status: status.toString(),
        });

        this.requestDuration.observe({
            method,
            route,
            status: status.toString(),
        },
        duration);
    }

    incrementInFlight(): void {
        this.requestsInFlight.inc();
    }

    decrementInFlight(): void {
        this.requestsInFlight.dec();
    }
}