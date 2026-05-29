import { Injectable } from '@nestjs/common';
import { Kafka } from '@nestjs/microservices/external/kafka.interface';
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

@Injectable()
export class KafkaHealthService extends HealthIndicator {
  private kafka = new Kafka({
    clientId: 'health-check',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  async isHealthy(): Promise<HealthIndicatorResult> {
    let admin = this.kafka.admin();
    try {
      await admin.connect();

      await admin.fetchTopicMetadata();

      return this.getStatus(KafkaHealthService.name, true);
    } catch (error) {
      throw new HealthCheckError(
        'Kafka check failed',
        this.getStatus(KafkaHealthService.name, false),
      );
    }finally {
      await admin.disconnect();
    }
  }
}