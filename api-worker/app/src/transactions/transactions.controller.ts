import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SyncTransactionDto } from 'src/graph/dtos/syncTransaction.dto';
import { GraphService } from 'src/graph/graph.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly graphService: GraphService){}
    @Post("sync-check")
    @HttpCode(HttpStatus.CREATED)
    async syncTransaction(
        @Body() payload: SyncTransactionDto
    ){
        return await this.graphService.syncTransactionEdge(payload);
    }
}
