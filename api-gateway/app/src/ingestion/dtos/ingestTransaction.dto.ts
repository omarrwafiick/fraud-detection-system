import { IsString, IsNumber, IsPositive, IsISO8601, IsObject, ValidateNested, IsNotEmpty, IsIP } from 'class-validator';
import { Type } from 'class-transformer';


class MainTransactionDto {
  @IsString()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}

class SenderDto extends MainTransactionDto {

  @IsString()
  @IsNotEmpty()
  device_id: string;

  @IsIP()
  ip_address: string;
}

class ReceiverDto extends MainTransactionDto {
  @IsString()
  @IsNotEmpty()
  bank_code: string;
}

export class IngestTransactionDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

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