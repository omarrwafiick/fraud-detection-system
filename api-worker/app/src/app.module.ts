import { Module } from '@nestjs/common';
import { RulesModule } from './rules/rules.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantModule } from './tenant/tenant.module';
import { GraphModule } from './graph/graph.module';
import { AlertsModule } from './alerts/alerts.module';
import { CasesModule } from './cases/cases.module';
import { JwtAuthGuard } from './common/guards/jwtAuth.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { ApikeyModule } from './apikey/apikey.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EvaluationModule } from './evaluation/evaluation.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    ApikeyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'fraud_admin',
      password: process.env.DATABASE_PW || 'super_secure_password_2026',
      database: process.env.DATABASE_NAME || 'fraud_detection_db',
      entities: [
        join(__dirname, '**', '*.entity.{ts,js}'), 
        join(__dirname, '/../../**/*.pivot.ts'), 
      ],
      synchronize: process.env.ENV_MODE ? process.env.ENV_MODE === 'development' : true,
      logging: process.env.ENV_MODE === 'development',
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10,   // 10 requests per minute globally
    }]),
    EvaluationModule,
    CacheModule.register({
      ttl: 5000, // Time-to-live in milliseconds
      max: 1000, // Maximum number of items in cache
      isGlobal: true, // Makes CacheModule available everywhere without re-importing
    }),
    HealthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secure_cluster_token_2026',
      signOptions: { expiresIn: '1d' },
    }),
    ProfileModule,
    TransactionsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [JwtAuthGuard]
})
export class AppModule {}
