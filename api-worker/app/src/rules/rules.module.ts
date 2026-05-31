import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rules.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { RulesService } from './rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), TenantModule],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [RulesService]
})
export class RulesModule {}
