import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [ApiModule],
  controllers: [IngestionController],
  providers: [IngestionService]
})
export class IngestionModule {}
