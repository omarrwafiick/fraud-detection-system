import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [AuthModule, EventsModule, IngestionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
