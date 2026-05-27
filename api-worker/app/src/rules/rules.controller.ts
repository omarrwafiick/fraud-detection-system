import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuth.guard';
import { CreateRuleDto } from './dtos/createRule.dto';

@UseGuards(JwtAuthGuard)
@Controller('rules')
export class RulesController {
    constructor(private readonly rulesService: RulesService){}

    @Post("")
    async createRule(@Body() payload: CreateRuleDto){

    }

    @Get("")
    async getRules(){

    }
}
