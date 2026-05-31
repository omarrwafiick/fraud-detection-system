import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './entities/transactions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesModule } from 'src/rules/rules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions]), RulesModule],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
