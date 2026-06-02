export class ProfileDto{
    id: number;
    firstname: string;
    lastname: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: TenantDto;
}

class TenantDto{
    name: string;
    webhookUrl: string;
    createdAt: Date;
    updatedAt: Date;
}