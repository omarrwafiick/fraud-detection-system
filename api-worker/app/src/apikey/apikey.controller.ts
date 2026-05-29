import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApikeyService } from './apikey.service';
import * as express from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuth.guard';

@Controller('apikey')
export class ApikeyController {
    constructor(private readonly apikeyService: ApikeyService){}
    @Get("")
    @UseGuards(JwtAuthGuard)
    async generateApiKey(@Req() request: express.Request){
        const userId = (request.headers['x-user-id'] || request.headers['X-USER_ID']) as string;
        return await this.apikeyService.createKey(userId);
    }
}
