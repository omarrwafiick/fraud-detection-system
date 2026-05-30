import { IsString, IsNotEmpty, IsObject, IsIn, IsNumber, IsPositive } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['MEDIUM', 'HIGH', 'CRITICAL'])
  severity: string;

  @IsNumber()
  @IsPositive()
  tenantId: number;
}