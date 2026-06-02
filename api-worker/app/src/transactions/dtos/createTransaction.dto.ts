export class CreateTransactionDto {
    tenantId: number;

    ruleId?: number | null;

    transaction_id: string;

    amount: number;

    amountUnit: 'CENTS';

    currency: string;

    status: 'APPROVED' | 'REJECTED';

    sender_user_id: string;

    external_sender_account_id: string;

    sender_device_id: string;

    sender_ip_address: string;

    external_receiver_account_id: string;

    timestamp: Date;
}