import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CasesService } from './cases.service';
import { UpdateCaseDto } from './dto/updateCase.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
    constructor(private readonly casesService: CasesService){}

    @Get("")
    async getFraudCasesList(){

    }

    @Patch(":id")
    async updateCase(@Param() id: number, @Body() payload: UpdateCaseDto){

    }
}
