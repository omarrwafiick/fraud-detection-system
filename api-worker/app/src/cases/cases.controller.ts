import { Body, Controller, Get, Param, Patch, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CasesService } from './cases.service';
import { UpdateCaseDto } from './dto/updateCase.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetCaseDto } from './dto/getCases.dto';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';

@UseGuards(JwtAuthGuard)
@Controller('cases')
@UseInterceptors(CacheInterceptor) 
export class CasesController {
    constructor(private readonly casesService: CasesService){}

    @Get("")
    async getFraudCasesList(
        @Req() request: express.Request,
    ): Promise<GetCaseDto[]>{
        const tenantId = (request.user as IUser).tenantId as number;
        return await this.casesService.getCases(tenantId);
    }

    @Patch(":id")
    async updateCase(
        @Param() id: number, 
        @Body() payload: UpdateCaseDto
    ): Promise<{ isUpdated: boolean }>{
        const isUpdated = await this.casesService.updateCase(id, payload);
        return { isUpdated }
    }
}
