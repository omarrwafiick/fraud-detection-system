import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { 
  //KafkaHealthService, 
  RedisHealthService 
} from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule,
  ],
  controllers: [HealthController],
  providers: [
    RedisHealthService, 
    //KafkaHealthService,
  ]
})
export class HealthModule {}
