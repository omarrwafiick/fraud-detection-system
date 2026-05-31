import { IsString, IsNumber, IsPositive, IsISO8601, IsObject, ValidateNested, IsNotEmpty, IsIP, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class SenderDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  device_id: string;

  @IsIP()
  ip_address: string;
}

class ReceiverDto {
  @IsString()
  @IsNotEmpty()
  account_id: string;
}

export class IngestTransactionDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['CENTS'])
  amountUnit: 'CENTS';

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsISO8601()
  timestamp: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SenderDto)
  sender: SenderDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ReceiverDto)
  receiver: ReceiverDto;
}