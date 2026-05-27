import { Module } from '@nestjs/common';
import { RulesModule } from './rules/rules.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantModule } from './tenant/tenant.module';
import { GraphModule } from './graph/graph.module';
import { AlertsModule } from './alerts/alerts.module';
import { CasesModule } from './cases/cases.module';
import { JwtAuthGuard } from './shared/guards/jwtAuth.guard';

@Module({
  imports: [
    RulesModule, 
    AnalyticsModule, 
    TenantModule, 
    GraphModule, 
    AlertsModule, 
    CasesModule,
    JwtAuthGuard,
  ],
  controllers: [],
  providers: [],
  exports: [JwtAuthGuard]
})
export class AppModule {}
