import { Injectable } from '@nestjs/common';
import { Kafka } from '@nestjs/microservices/external/kafka.interface';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { RedisInstance } from 'src/common/redis/redis.client';

@Injectable()
export class HealthService extends HealthIndicator {
  private readonly redis = RedisInstance.get();

  private kafka = new Kafka({
    clientId: 'health-check',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  async isHealthy(key: 'redis' | 'kafka'): Promise<HealthIndicatorResult> {
    try {
      if(key === 'redis'){
        await this.handleRedisCheck();
      } else if(key === 'kafka'){
        await this.handleKafkaCheck();
      }
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false),
      );
    }
  }

  private async handleRedisCheck(){
    const response = await this.redis.ping();

    if (response !== 'PONG') {
        throw new Error('Invalid Redis response');
    }
  }

  private async handleKafkaCheck(){
    const admin = this.kafka.admin();
    try {
      await admin.connect();

      await admin.fetchTopicMetadata();
    } catch (error) {
      throw new HealthCheckError(
        'Kafka check failed',
        this.getStatus('kafka', false),
      );
    } finally {
      await admin.disconnect();
    }
  }
}