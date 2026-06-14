import { Controller, Get, HttpCode, HttpStatus, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApikeyService } from './apikey.service';
import * as express from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { IUser } from 'src/auth/interfaces/user.interface';

@Controller('apikey')
export class ApikeyController {
    constructor(private readonly apikeyService: ApikeyService){}
    @Get("")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async generateApiKey(@Req() request: express.Request){
        const userId = (request.user as IUser).id;
        if(!userId){
            throw new UnauthorizedException("User ID not found in request context");
        }
        return await this.apikeyService.createKey(userId);
    }
}
