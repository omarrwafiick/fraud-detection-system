import { IsString, IsNotEmpty, IsObject, IsIn, IsNumber, IsPositive } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['HIGH_VALUE_VELOCITY_CHECK', 'DETECT_TRANSACTION_CYCLES', 'DEGREES_OF_SEPARATION_LIMIT'])
  name: 'HIGH_VALUE_VELOCITY_CHECK' | 'DETECT_TRANSACTION_CYCLES' | 'DEGREES_OF_SEPARATION_LIMIT';

  @IsString()
  @IsIn(['MEDIUM', 'HIGH', 'CRITICAL'])
  severity: string;

  @IsNumber()
  @IsPositive()
  tenantId: number;
}