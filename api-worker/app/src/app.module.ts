import { Module } from '@nestjs/common';
import { RulesModule } from './rules/rules.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantModule } from './tenant/tenant.module';
import { GraphModule } from './graph/graph.module';
import { AlertsModule } from './alerts/alerts.module';
import { CasesModule } from './cases/cases.module';
import { JwtAuthGuard } from './shared/guards/jwtAuth.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { SyncCheckModule } from './sync-check/sync-check.module';
import { ApikeyModule } from './apikey/apikey.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RulesModule, 
    AnalyticsModule, 
    TenantModule, 
    GraphModule, 
    AlertsModule, 
    CasesModule,
    AuthModule,
    JwtAuthGuard,
    ApikeyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PW || 'root',
      database: process.env.DATABASE_NAME || 'test',
      entities: [join(__dirname, '**', '*.model.{ts,js}')],
      synchronize: process.env.ENV_MODE === 'development',
    }),
    SyncCheckModule,
  ],
  controllers: [],
  providers: [],
  exports: [JwtAuthGuard]
})
export class AppModule {}
