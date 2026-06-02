export class GetRuleDto{
    id: number;
    name: 'HIGH_VALUE_VELOCITY_CHECK' | 'DETECT_TRANSACTION_CYCLES' | 'DEGREES_OF_SEPARATION_LIMIT';
    severity: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}