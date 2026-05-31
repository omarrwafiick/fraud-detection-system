import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { AnalyticsSummaryResponseDto } from 'src/analytics/dtos/analyticsVolumeSummary.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly repository: Repository<Transactions>,
  ) {}

  async getDashboardAnalyticsSummary(tenantId: number): Promise<AnalyticsSummaryResponseDto> {
    const rawMetrics = await this.repository
      .createQueryBuilder('tx')
      .select('COUNT(tx.id)', 'totalCount')
      .addSelect("COUNT(CASE WHEN tx.status = 'APPROVED' THEN 1 END)", 'approvedCount')
      .addSelect("COUNT(CASE WHEN tx.status = 'REJECTED' THEN 1 END)", 'declinedCount')
      .addSelect('SUM(tx.amount)', 'totalVolume')
      .addSelect("SUM(CASE WHEN tx.status = 'APPROVED' THEN tx.amount END)", 'approvedVolume')
      .addSelect("SUM(CASE WHEN tx.status = 'REJECTED' THEN tx.amount END)", 'declinedVolume')
      .where('tx.tenantId = :tenantId', { tenantId })
      .getRawOne();

    const totalCount = parseInt(rawMetrics.totalCount || '0', 10);
    const approvedCount = parseInt(rawMetrics.approvedCount || '0', 10);
    const rejectedCount = parseInt(rawMetrics.declinedCount || '0', 10);

    const totalVolume = Math.round(parseFloat(rawMetrics.totalVolume || '0'));
    const approvedVolume = Math.round(parseFloat(rawMetrics.approvedVolume || '0'));
    const rejectedVolume = Math.round(parseFloat(rawMetrics.declinedVolume || '0'));

    if (totalCount === 0) {
      return {
        volumes: { totalVolume: 0, approvedVolume: 0, rejectedVolume: 0},
        counts: { totalCount: 0, approvedCount: 0, rejectedCount: 0 },
        riskIndicators: { fraudRatePercentage: 0, averageTransactionValue: 0, topTriggeredRules: [] },
        meta: { amountUnit: 'UNKNOWN' },
        generatedAt: Date.now(),
      };
    }

    const fraudRatePercentage = parseFloat(((rejectedCount / totalCount) * 100).toFixed(2));
    const averageTransactionValue = Math.round(totalVolume / totalCount);

    const topTriggeredRules = await this.repository
      .createQueryBuilder('tx')
      .innerJoin('tx.rule', 'rule')
      .select('rule.name', 'ruleName')
      .addSelect('COUNT(tx.id)', 'triggerCount')
      .where('tx.tenantId = :tenantId AND tx.status = :status', { tenantId, status: 'REJECTED' })
      .groupBy('rule.id')
      .addGroupBy('rule.name')
      .orderBy('"triggerCount"', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      volumes: {
        totalVolume,
        approvedVolume,
        rejectedVolume,
      },
      counts: {
        totalCount,
        approvedCount,
        rejectedCount,
      },
      riskIndicators: {
        fraudRatePercentage,
        averageTransactionValue,
        topTriggeredRules: topTriggeredRules.map(r => ({
          ruleName: r.ruleName,
          triggerCount: parseInt(r.triggerCount, 10)
        })),
      },
      meta: {
        amountUnit: 'CENTS',
      },
      generatedAt: Date.now(),
    };
  }
}