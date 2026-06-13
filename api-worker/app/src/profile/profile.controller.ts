import { Controller, Get, HttpCode, HttpStatus, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('profile')
@UseInterceptors(CacheInterceptor)
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ){}

    @Get("")
    @HttpCode(HttpStatus.OK)
    async getProfile(
        @Req() request: express.Request,
    ){
        const userId = (request.user as IUser).id;
        if(!userId){
            throw new UnauthorizedException("User ID not found in request context");
        }
        return this.profileService.getProfile(userId);
    }

    @Get('test-dummy')   // Compiles out to match: /worker/test-dummy
    @HttpCode(HttpStatus.OK)
    getDummyTest() {
        return {
        status: 'success',
        message: 'Dummy testing endpoint works perfectly via NestJS native routing tree!',
        timestamp: new Date().toISOString(),
        };
    }
}
