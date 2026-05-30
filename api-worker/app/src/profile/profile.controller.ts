import { Controller, Get, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import * as express from 'express';
import { User } from 'src/auth/entities/user.entity';

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ){}

    @Get("")
    async getProfile(
        @Req() request: express.Request,
    ){
        const userId = (request.user as any).id;
        return this.profileService.getProfile(userId);
    }
}
