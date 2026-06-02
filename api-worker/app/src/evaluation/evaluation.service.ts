import { Injectable, Logger } from "@nestjs/common";
import { IngestTransactionDto } from "./dtos/ingestTransaction.dto";
import { RulesService } from "src/rules/rules.service";
import { GraphService } from "src/graph/graph.service";
import { RuleSeverity } from "src/rules/entities/rules.entity";
import { TransactionsService } from "src/transactions/transactions.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { RejectedTransactionEvent } from "src/alerts/events/rejected-transaction.event";
import { TriggerType } from "src/cases/entities/case.entity";

@Injectable()
export class EvaluationService {
  constructor(
    private readonly rulesService: RulesService,
    private readonly graphService: GraphService,
    private readonly transactionsService: TransactionsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(EvaluationService.name);

  async evaluateRiskProfile(payload: { metadata: any; data: IngestTransactionDto }): Promise<void> {
    const { metadata, data } = payload;
    const tenantId = metadata.tenantId;

    this.logger.log(`Evaluating rule-set blueprints for Bank Tenant ID: ${tenantId}`);
    
    await this.graphService.syncTransactionEdge({
      tenantId: tenantId,
      transactionId: data.transaction_id,
      senderAccountId: data.sender.account_id,
      receiverAccountId: data.receiver.account_id,
      amount: data.amount,
      status: 'PROCESSING',
      sender_device_id: data.sender.device_id,
    });
    
    const allRules = await this.rulesService.getRules(tenantId);
    const activeRules = allRules.filter(rule => rule.isEnabled);

    let ultimateStatus: 'APPROVED' | 'REJECTED' = 'APPROVED';
    let triggeredRuleId: number | null = null;
    let ruleSeverity: { key: RuleSeverity | string; value: string } = { key: RuleSeverity.MEDIUM, value: 'Low' };

    for (const rule of activeRules) {
      this.logger.log(`Applying rule: ${rule.name} for transaction ${data.transaction_id}`);
      
      let ruleTriggered = false;

      if (rule.name === 'HIGH_VALUE_VELOCITY_CHECK') {
        ruleTriggered = await this.graphService.hasHighValueTransactions(tenantId, data.sender.account_id, 50);
      } 
      else if (rule.name === 'DETECT_TRANSACTION_CYCLES') {
        ruleTriggered = await this.graphService.detectTransactionCycles(tenantId, data.sender.account_id);
      } 
      else if (rule.name === 'DEGREES_OF_SEPARATION_LIMIT') {
        const distance = await this.graphService.getDegreesOfSeparationFromFraud(tenantId, data.sender.account_id);
        ruleTriggered = distance.hasRiskPath && distance.degrees <= 2;
      } 
      else {
        this.logger.warn(`Unknown rule ${rule.name} for Bank Tenant ID: ${tenantId}. Skipping.`);
        continue;
      }

      if (ruleTriggered) {
        ultimateStatus = 'REJECTED';
        triggeredRuleId = rule.id;
        ruleSeverity = this.rulesService.getSeverityString(rule.severity);
        break;
      }
    }

    const newTransaction = await this.transactionsService.saveTransactionEvaluationResult({
      transaction_id: data.transaction_id,
      tenantId: tenantId,
      amount: data.amount,
      amountUnit: data.amountUnit,
      currency: data.currency,
      sender_user_id: data.sender.user_id,
      external_sender_account_id: data.sender.account_id,
      sender_device_id: data.sender.device_id,
      sender_ip_address: data.sender.ip_address,
      external_receiver_account_id: data.receiver.account_id,
      timestamp: new Date(data.timestamp),
      status: ultimateStatus,
      ruleId: triggeredRuleId,
    });

    await this.graphService.updateTransactionStatus(data.transaction_id, tenantId, ultimateStatus);

    if (ultimateStatus === 'REJECTED') {
      this.eventEmitter.emit(
        'transaction.rejected', 
        new RejectedTransactionEvent(
          tenantId,
          newTransaction.id,
          TriggerType.CUSTOM_RULE_VIOLATION,
          data.sender.account_id,
          { device_id: data.sender.device_id, ip_address: data.sender.ip_address },
          `Transaction rejected due to rule violation: ${triggeredRuleId}. Severity: ${ruleSeverity.value}`,
        )
      );
    }
    
    this.logger.log(`Evaluation complete for ${data.transaction_id}. Risk profile: ${ultimateStatus}. Triggered Rule ID: ${triggeredRuleId}`);
  }
}