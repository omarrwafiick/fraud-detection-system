import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CookieService } from 'src/common/cookies/cookie';
import * as express from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secure_cluster_token_2026',
    });
  }

  async validate(payload: { sub: string; email: string; roles: string[], tenantId: number }) {
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired authentication session.');
    }
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      tenantId: payload.tenantId,
    };
  }
}
const ACCESS_TOKEN_NAME = 'access-token';

function cookieExtractor(req: express.Request): string | null{
  return CookieService.get(ACCESS_TOKEN_NAME, req);
}