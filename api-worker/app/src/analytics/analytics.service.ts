import { Injectable } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { AnalyticsSummaryResponseDto } from './dtos/analyticsVolumeSummary.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly transactionService: TransactionsService
    ){}

    async getSummary(tenantId: number): Promise<AnalyticsSummaryResponseDto> {
        const summary = await this.transactionService.getDashboardAnalyticsSummary(tenantId);

        return {
            volumes: summary.volumes,
            counts: summary.counts,
            riskIndicators: summary.riskIndicators,
            meta: summary.meta,
            generatedAt: summary.generatedAt,
        }
    }
}
