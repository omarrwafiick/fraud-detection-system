export class AnalyticsVolumeSummaryDto {
  totalVolume: number;
  
  approvedVolume: number;

  rejectedVolume: number;
}

export class AnalyticsCountSummaryDto {
  totalCount: number;

  approvedCount: number;

  rejectedCount: number;
}

export class AnalyticsRiskMetricsDto {
  fraudRatePercentage: number;

  averageTransactionValue: number;

  topTriggeredRules: Array<{ ruleName: string; triggerCount: number }>;
}

export class AnalyticsSummaryResponseDto {
  volumes: AnalyticsVolumeSummaryDto;

  counts: AnalyticsCountSummaryDto;

  riskIndicators: AnalyticsRiskMetricsDto;

  meta: {
    amountUnit: 'CENTS' | 'UNKNOWN';
  }
  
  generatedAt: number;
}