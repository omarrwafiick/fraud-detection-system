import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { SignUpUserDto } from './dtos/signup.dto';
import * as express from 'express';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { IUser } from './interfaces/user.interface';
import { RBACService } from './services/rbac.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('v1/auth')
export class AuthController {
  private readonly ACCESS_TOKEN_COOKIE = {
    name: 'access_token',
    period: 24 * 60 * 60 * 1000, // 1 day
  };
  private readonly REFRESH_TOKEN_COOKIE = {
    name: 'refresh_token',
    period: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  constructor(
    private readonly authService: AuthService,
    private readonly rbacService: RBACService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.validateUserCredentials(payload);

    res.cookie(this.ACCESS_TOKEN_COOKIE.name, result.tokens?.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.ACCESS_TOKEN_COOKIE.period,
    });

    res.cookie(this.REFRESH_TOKEN_COOKIE.name, result.tokens?.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.REFRESH_TOKEN_COOKIE.period,
    });

    return result.user;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() payload: SignUpUserDto) {
    return (await this.authService.signup(payload)).user;
  }

  @Post('token/refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refreshToken(
    @Body() payload: RefreshTokenDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.refreshUserSession(payload);
    
    res.cookie(this.REFRESH_TOKEN_COOKIE.name, tokens?.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.REFRESH_TOKEN_COOKIE.period,
    });
  }

  @Post('permissions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async permissions(@Req() request: express.Request) {
    const userId = (request.user as IUser).id;
    if(!userId){
      throw new UnauthorizedException("User ID not found in request context");
    }
    return await this.rbacService.getUserRolesWithPermissions(userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie(this.ACCESS_TOKEN_COOKIE.name);
    res.clearCookie(this.REFRESH_TOKEN_COOKIE.name);
  }
}