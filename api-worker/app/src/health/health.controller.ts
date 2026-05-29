import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheckService,
  HealthCheck, 
  TypeOrmHealthIndicator 
} from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthService : HealthService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
        () => this.db.pingCheck('postgres'),
        () => this.healthService.isHealthy('redis'),
        () => this.healthService.isHealthy('kafka'),
    ]);
  }
}
