import { TriggerType } from "src/cases/entities/case.entity";

export class RejectedTransactionEvent {
  constructor(
    public readonly tenantId: number,
    public readonly transactionId: number,
    public readonly triggerType: TriggerType, 
    public readonly suspectEntityId: string,
    public readonly metadata: any,
    public readonly resolutionNotes: string,
  ) {}
}