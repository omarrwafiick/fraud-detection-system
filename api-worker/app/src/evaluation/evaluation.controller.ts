import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { EvaluationService } from './evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  private readonly logger = new Logger(EvaluationController.name);

  constructor(private readonly evaluationService: EvaluationService) {}

  @EventPattern('transactions.incoming')
  async handleIncomingTransaction(
    @Payload() message: any, 
    @Ctx() context: KafkaContext
  ) {
    const partition = context.getPartition();
    this.logger.log(`Received event via Kafka partition [${partition}]: Tracking ID: ${message.data?.transaction_id}`);
    try {
      await this.evaluationService.evaluateRiskProfile(message);
    } catch (error: any) {
      this.logger.error(`Critical transaction pipeline execution breakdown: ${error.message}`, error.stack);
    }
  }
}