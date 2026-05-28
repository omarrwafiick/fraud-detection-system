import { Module } from '@nestjs/common';
import { IngestionModule } from './ingestion/ingestion.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaProducerModule } from './kafka-producer/kafka-producer.module';

@Module({
  imports: [
    IngestionModule, 
    ApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaProducerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
