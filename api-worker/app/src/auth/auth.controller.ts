import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseUserResponseDto, LoginUserDto } from './dtos/login.dto';
import { SignUpUserDto } from './dtos/signup.dto';
import * as express from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post("login")
    async login(
        @Req() request: express.Request,
        @Res() response: express.Response,
        @Body() payload: LoginUserDto
    ) 
    : Promise<BaseUserResponseDto> {
        return await this.authService.login(request, response, payload);
    }

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Res() response: express.Response,
        @Body() payload: SignUpUserDto
    ) 
    : Promise<BaseUserResponseDto>{
        return await this.authService.signup(response, payload);
    }

    @Get("refresh")
    @UseGuards(JwtAuthGuard)
    async refreshToken(
        @Req() request: express.Request,
        @Res() response: express.Response
    ): Promise<string>{
        return await this.authService.refreshToken((request.user as any)?.id || 0, response);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    logout(@Res() response: express.Response): void{
        return this.authService.logout(response);
    }
}
