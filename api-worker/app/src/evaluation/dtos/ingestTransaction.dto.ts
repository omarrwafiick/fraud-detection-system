class SenderDto {
  user_id: string;

  account_id: string;

  device_id: string;

  ip_address: string;
}

class ReceiverDto {
  account_id: string;
}

export class IngestTransactionDto {
  transaction_id: string;

  amount: number;

  amountUnit: 'CENTS';

  currency: string;

  timestamp: string;

  sender: SenderDto;

  receiver: ReceiverDto;
}