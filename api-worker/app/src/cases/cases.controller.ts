import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CasesService } from './cases.service';
import { UpdateCaseDto } from './dto/updateCase.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetCaseDto } from './dto/getCases.dto';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';
import { RequestPaginatorDto } from 'src/common/dtos/request-paginator.dto';

@UseGuards(JwtAuthGuard)
@Controller('cases')
@UseInterceptors(CacheInterceptor) 
export class CasesController {
    constructor(private readonly casesService: CasesService){}

    @Get("")
    @HttpCode(HttpStatus.OK)
    async getFraudCasesList(
        @Req() request: express.Request,
        @Body() payload: RequestPaginatorDto,
    ): Promise<GetCaseDto[]>{
        const tenantId = (request.user as IUser).tenantId as number;
        if(!tenantId){
            throw new UnauthorizedException("Tenant ID not found in user context");
        }
        return await this.casesService.getCases(tenantId, payload);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async updateCase(
        @Param() id: number, 
        @Body() payload: UpdateCaseDto
    ): Promise<{ isUpdated: boolean }>{
        const isUpdated = await this.casesService.updateCase(id, payload);
        return { isUpdated }
    }
}
