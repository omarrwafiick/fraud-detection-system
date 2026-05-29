import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { KafkaHealthService, RedisHealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [RedisHealthService, KafkaHealthService]
})
export class HealthModule {}
