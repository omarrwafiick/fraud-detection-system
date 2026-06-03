import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CreateRuleDto } from './dtos/createRule.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetRuleDto } from './dtos/getRule.dto';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';
import { RequestPaginatorDto } from 'src/common/dtos/request-paginator.dto';

@UseGuards(JwtAuthGuard)
@Controller('rules')
@UseInterceptors(CacheInterceptor)
export class RulesController {
    constructor(private readonly rulesService: RulesService){}

    @Get("")
    @HttpCode(HttpStatus.OK)
    async getRules(
        @Req() request: express.Request,
        @Body() payload: RequestPaginatorDto,
    ): Promise<GetRuleDto[]>
    {
        const tenantId = (request.user as IUser).tenantId as number;
        if(!tenantId){
            throw new UnauthorizedException("Tenant ID not found in user context");
        }
        return await this.rulesService.getRules(tenantId, payload);
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
