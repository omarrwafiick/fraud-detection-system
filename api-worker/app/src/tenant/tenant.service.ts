import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly repository: Repository<Tenant>,
  ) {}

  async createNewTenant(
    payload: { name: string; webHookUrl: string }, 
    manager?: EntityManager
  ): Promise<Tenant> {
    const repo = manager ? manager.getRepository(Tenant) : this.repository;

    const tenantExists = await repo.existsBy([
        {name: payload.name},
        {webhookUrl: payload.webHookUrl},
    ]);

    if (tenantExists){
        throw new ConflictException('Tenant business name or webhook url is already registered');
    }

    const newTenant = repo.create({
      name: payload.name,
      webhookUrl: payload.webHookUrl,
    });

    return await repo.save(newTenant);
  }

  async tenantExistsById(tenantId: number){
    return await this.repository.existsBy([
        {id: tenantId }
    ]);
  }
}