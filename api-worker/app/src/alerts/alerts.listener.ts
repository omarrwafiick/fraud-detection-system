import { Injectable, Logger } from "@nestjs/common";
import { RejectedTransactionEvent } from './events/rejected-transaction.event';
import { OnEvent } from '@nestjs/event-emitter';
import { CasesService } from 'src/cases/cases.service';
import { TenantService } from 'src/tenant/tenant.service';
import axios from "axios";

@Injectable()
export class AlertsListener {
  private readonly logger = new Logger(AlertsListener.name);

  constructor(
    private readonly casesService: CasesService,
    private readonly tenantService: TenantService,
  ) {}

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

    const tenant = await this.tenantService.getTenantById(payload.tenantId);

    if(!tenant){
      this.logger.error(`Tenant not found for ID: ${payload.tenantId}`);
      return;
    }

    await axios.post(tenant.webhookUrl, {
      event: 'transaction.rejected',
      data: {
        transactionId: payload.transactionId,
        triggerType: payload.triggerType,
        suspectEntityId: payload.suspectEntityId,
        metadata: payload.metadata,
        resolutionNotes: payload.resolutionNotes,
      }
    }).catch(error => {
      this.logger.error(`Failed to send webhook for tenant ID: ${payload.tenantId}`, error);
    });
  }
}
