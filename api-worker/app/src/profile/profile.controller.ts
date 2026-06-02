import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
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
    async getProfile(
        @Req() request: express.Request,
    ){
        const userId = (request.user as IUser).id;
        return this.profileService.getProfile(userId);
    }
}
