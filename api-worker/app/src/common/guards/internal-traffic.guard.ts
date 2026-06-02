import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class InternalTrafficGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    const forwardedBy = request.headers['x-forwarded-by'];

    if (forwardedBy !== 'fraud-api-gateway') {
      throw new UnauthorizedException('Direct access to the upstream worker node is strictly forbidden.');
    }

    return true;
  }
}