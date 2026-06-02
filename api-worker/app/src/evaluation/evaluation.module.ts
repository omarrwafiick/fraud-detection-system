import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { RulesModule } from 'src/rules/rules.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [ RulesModule, TransactionsModule],
  controllers: [EvaluationController],
  providers: [EvaluationService]
})
export class EvaluationModule {}
