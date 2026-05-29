import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantService {
    constructor(
        @InjectRepository(Tenant)
        private readonly repository: Repository<Tenant>,
    ){}
    async createNewTenant(payload: { name: string, webHookUrl: string }): Promise<Tenant> {
        const isTenantExists = await this.repository.findAndCount({
            where: [
                { name: payload.name },
                { webhookUrl: payload.webHookUrl }
            ]
        });

        if(isTenantExists[1] > 0){
            throw new ConflictException('Tenant already registered');
        }

        const newTenant = await this.repository.create({
            name: payload.name,
            webhookUrl: payload.webHookUrl,
        });

        await this.repository.save(newTenant);

        return newTenant;
    }
}
