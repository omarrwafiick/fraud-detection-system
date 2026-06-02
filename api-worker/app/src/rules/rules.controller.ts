import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CreateRuleDto } from './dtos/createRule.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetRuleDto } from './dtos/getRule.dto';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';

@UseGuards(JwtAuthGuard)
@Controller('rules')
@UseInterceptors(CacheInterceptor)
export class RulesController {
    constructor(private readonly rulesService: RulesService){}

    @Get("")
    async getRules(
        @Req() request: express.Request,
    ): Promise<GetRuleDto[]>
    {
        const tenantId = (request.user as IUser).tenantId as number;
        return await this.rulesService.getRules(tenantId);
    }

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    async createRule(
        @Body() payload: CreateRuleDto
    ){
        const id = await this.createRule(payload);
        return { id }
    }
}
