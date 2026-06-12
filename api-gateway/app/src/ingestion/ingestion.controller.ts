import { Body, Controller, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiKeyGuard } from './guards/ApiKey.guard';
import { IngestTransactionDto } from './dtos/ingestTransaction.dto';
import { ApiService } from '../api/api.service';
import * as express from 'express';
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
        private readonly apiService: ApiService,
    ){}

    @Post("transaction")
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.CREATED)
    async makeTransaction(@Body() payload: IngestTransactionDto){
       await this.ingestionService.processTransaction(payload); 
    }

    @Post("transaction/sync-check")
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.CREATED)
    async syncCheckTransaction(
        @Request() request: express.Request, 
        @Response() response: express.Response
    ){
        return await this.apiService.handleRerouting('POST', request, response);
    }
}
