import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { SignUpUserDto } from './dtos/signup.dto';
import * as express from 'express';

@Controller('v1/auth')
export class AuthController {
  private readonly COOKIE_NAME = 'access_token';

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.validateUserCredentials(payload);

    res.cookie(this.COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('signup')
  async signup(@Body() payload: SignUpUserDto) {
    return this.authService.signup(payload);
  }

  @Post('token/refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refreshToken(
    @Res({ passthrough: true }) res: express.Response,
    
    @Req() req: express.Request,
  ) {
    return await this.authService.refreshUserSession((req.user as any)?.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie(this.COOKIE_NAME);
  }
}