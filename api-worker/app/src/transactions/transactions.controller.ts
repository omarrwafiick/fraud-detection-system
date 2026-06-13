import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/apikey/guards/apiKey.guard';
import { SyncTransactionDto } from 'src/graph/dtos/syncTransaction.dto';
import { GraphService } from 'src/graph/graph.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly graphService: GraphService){}
    @Post("sync-check")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(ApiKeyGuard)
    async syncTransaction(
        @Body() payload: SyncTransactionDto
    ){
        return await this.graphService.syncTransactionEdge(payload);
    }
}
