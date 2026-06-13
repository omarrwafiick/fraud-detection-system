import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiKeyGuard } from './guards/ApiKey.guard';
import { IngestTransactionDto } from './dtos/ingestTransaction.dto';
import { Throttle } from '@nestjs/throttler';

@Throttle(
    { 
        default: {
            ttl: 60000, // 1 minute
            limit: 3, // 3 requests per minute
        } 
    }
)
@Controller('ingestion')
export class IngestionController {
    constructor(
        private readonly ingestionService: IngestionService,
    ){}

    @Post("transaction")
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.CREATED)
    async makeTransaction(@Body() payload: IngestTransactionDto){
       await this.ingestionService.processTransaction(payload); 
    }
}
