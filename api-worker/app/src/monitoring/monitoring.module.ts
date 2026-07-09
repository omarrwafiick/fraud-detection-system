import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MonitoringController } from "./monitoring.controller";
import { MetricsService } from "./metrics/metrics.service";
import { HttpMetrics } from "./middleware/http/http.metrics";
import { HttpMetricsMiddleware } from "./middleware/http/http-metrics.middleware";

@Module({
    controllers: [
      MonitoringController,
    ],
    providers: [
      MetricsService,
      HttpMetrics,
    ],
    exports: [
      MetricsService,
      HttpMetrics,
    ],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpMetricsMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}