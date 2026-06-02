import { Injectable } from '@nestjs/common';
//import { Kafka } from '@nestjs/microservices/external/kafka.interface';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { RedisInstance } from 'src/common/redis/redis.client';

@Injectable()
export class RedisHealthService extends HealthIndicator {
  private readonly redis = RedisInstance.get();

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const response = await this.redis.ping();

      if (response !== 'PONG') {
        throw new Error('Invalid Redis response');
      }
      return this.getStatus(RedisHealthService.name, true);
    } catch (error) {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(RedisHealthService.name, false),
      );
    }
  }
}

// @Injectable()
// export class KafkaHealthService extends HealthIndicator implements OnModuleInit, OnModuleDestroy {
//   private kafka: Kafka;
//   private admin: Admin;

//   onModuleInit() {
//     this.kafka = new Kafka({
//       clientId: 'api-worker-health-monitor',
//       brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
//     });
//     this.admin = this.kafka.admin();
//   }

//   async isHealthy(): Promise<HealthIndicatorResult> {
//     try {
//       await this.admin.connect();
//       await this.admin.fetchTopicMetadata();

//       return this.getStatus(KafkaHealthService.name, true);
//     } catch (error: any) {
//       throw new HealthCheckError(
//         'Kafka broker cluster partition unreachable',
//         this.getStatus(KafkaHealthService.name, false, { message: error.message }),
//       );
//     }
//   }

//   async onModuleDestroy() {
//     try {
//       await this.admin.disconnect();
//     } catch {
//     }
//   }
// }