import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiKeyGuard } from './guards/ApiKey.guard';
import { IngestTransactionDto } from './dtos/ingestTransaction.dto';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService){}

    @Post("transaction")
    @UseGuards(ApiKeyGuard)
    async makeTransaction(@Body() payload: IngestTransactionDto){
        
    }

    @Post("transaction/sync-check")
    @UseGuards(ApiKeyGuard)
    async syncCheckTransaction(@Body() payload: IngestTransactionDto){
        
    }
}
