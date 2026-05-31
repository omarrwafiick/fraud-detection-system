export class SyncTransactionDto{
    tenantId: number;
    transactionId: string;
    senderAccountId: string;
    receiverAccountId: string;
    amount: number;
    status: string;
    sender_device_id: string;
}