import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheckService,
  HealthCheck, 
  TypeOrmHealthIndicator 
} from '@nestjs/terminus';
import { KafkaHealthService, RedisHealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly kafkaHealthService : KafkaHealthService,
    private readonly redisHealthService : RedisHealthService,
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
        () => this.redisHealthService.isHealthy(),
        () => this.kafkaHealthService.isHealthy(),
    ]);
  }
}
