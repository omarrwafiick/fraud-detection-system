import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService],
  exports: [TenantService]
})
export class TenantModule {}
