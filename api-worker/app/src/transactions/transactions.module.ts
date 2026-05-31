import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './entities/transactions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesModule } from 'src/rules/rules.module';
import { TransactionsController } from './transactions.controller';
import { GraphModule } from 'src/graph/graph.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions]), RulesModule, GraphModule],
  providers: [TransactionsService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
