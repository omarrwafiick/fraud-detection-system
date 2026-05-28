import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [EventsModule, IngestionModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
