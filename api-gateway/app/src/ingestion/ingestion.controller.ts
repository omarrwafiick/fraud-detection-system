import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiKeyGuard } from './guards/ApiKey.guard';
import { IngestTransactionDto } from './dtos/ingestTransaction.dto';
import { ApiService } from '../api/api.service';

@Controller('ingestion')
export class IngestionController {
    constructor(
        private readonly ingestionService: IngestionService, 
        private readonly apiService: ApiService,
    ){}

    @Post("transaction")
    @UseGuards(ApiKeyGuard)
    async makeTransaction(@Body() payload: IngestTransactionDto){
       await this.ingestionService.processTransaction(payload); 
    }

    @Post("transaction/sync-check")
    @UseGuards(ApiKeyGuard)
    async syncCheckTransaction(@Request() request: Request, @Body() payload: IngestTransactionDto){
        return await this.apiService.handleV1Calls('POST', request);
    }
}
