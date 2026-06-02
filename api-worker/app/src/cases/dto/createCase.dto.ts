import { TriggerType } from "../entities/case.entity";

export class CreateCaseDto {
    tenantId: number;
    transactionId: number;
    triggerType: TriggerType;
    suspectEntityId: string;
    metadata: any;
    resolutionNotes: string;
}