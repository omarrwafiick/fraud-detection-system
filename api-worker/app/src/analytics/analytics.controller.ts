import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsSummaryResponseDto } from './dtos/analyticsVolumeSummary.dto';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
@UseInterceptors(CacheInterceptor)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService){}

    @Get("summary")
    async getSummary(
        @Req() request: express.Request,
    ): Promise<AnalyticsSummaryResponseDto>{
        const tenantId = (request.user as IUser).tenantId;
        return await this.analyticsService.getSummary(tenantId);
    }
}
