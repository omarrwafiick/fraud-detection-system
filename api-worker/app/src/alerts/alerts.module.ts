import { Module } from '@nestjs/common';
import { AlertsListener } from './alerts.listener';
import { CasesModule } from 'src/cases/cases.module';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  providers: [AlertsListener],
  imports: [CasesModule, TenantModule],
})
export class AlertsModule {}
