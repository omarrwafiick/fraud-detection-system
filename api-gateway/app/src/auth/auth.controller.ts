import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsUserGuard } from './guards/isUser.guard';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("login")
    async login(@Body() payload: LoginDto){

    }

    @Post("signup")
    async signup(@Body() payload: SignUpDto){

    }

    @Get("refresh")
    async refresh(){

    }

    @Post("logout")
    logout(){

    }

    @Get("api-key")
    @UseGuards(IsUserGuard)
    async generateApiKey(){

    }
}
