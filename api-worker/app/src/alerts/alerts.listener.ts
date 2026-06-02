import { Injectable } from '@nestjs/common';
import { RejectedTransactionEvent } from './events/rejected-transaction.event';
import { OnEvent } from '@nestjs/event-emitter';
import { CasesService } from 'src/cases/cases.service';

@Injectable()
export class AlertsListener {
  constructor(private readonly casesService: CasesService) {}

  @OnEvent('transaction.rejected')
  async handleTransactionRejectedEvent(payload: RejectedTransactionEvent) {
    await this.casesService.createCase({
        tenantId: payload.tenantId,
        transactionId: payload.transactionId,
        triggerType: payload.triggerType,
        suspectEntityId: payload.suspectEntityId,
        metadata: payload.metadata,
        resolutionNotes: payload.resolutionNotes,
    });
  }
}
