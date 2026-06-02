import { Module } from '@nestjs/common';
import { AlertsListener } from './alerts.listener';
import { CasesModule } from 'src/cases/cases.module';

@Module({
  providers: [AlertsListener],
  imports: [CasesModule]
})
export class AlertsModule {}
