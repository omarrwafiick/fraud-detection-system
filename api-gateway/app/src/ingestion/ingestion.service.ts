import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IngestTransactionDto } from '../ingestion/dtos/ingestTransaction.dto';

@Injectable()
export class IngestionService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(IngestionService.name);
    constructor(
    @Inject('KAFKA_FRAUD_PRODUCER') private readonly kafkaClient: ClientKafka,
    ) {}

    async onModuleInit() {
        await this.kafkaClient.connect();
        this.logger.log('API Gateway: Kafka Producer Connected');
    }
    
    async processTransaction(data: IngestTransactionDto): Promise<EventResponse>{
        this.logger.log(`Processing transaction event payload: ${data.transaction_id}`);

        this.kafkaClient.emit('transactions.incoming', {
            key: data.transaction_id,
            value: data,
        });

        return { success: true, message: 'Transaction queued for processing' };
    }

    async onModuleDestroy() {
        await this.kafkaClient.close();
        this.logger.log('API Gateway: Kafka Producer Closed');
    }
}

type EventResponse = {
    success: boolean,
    message: string,
}