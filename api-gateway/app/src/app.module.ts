import { Module } from '@nestjs/common';
import { IngestionModule } from './ingestion/ingestion.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaProducerModule } from './kafka-producer/kafka-producer.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    IngestionModule, 
    ApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaProducerModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 20,   // 20 requests per minute globally
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
