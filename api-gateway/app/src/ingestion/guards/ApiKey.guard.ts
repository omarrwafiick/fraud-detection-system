import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RedisInstance } from '../../common/redis/redis.client';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly redisInstance = RedisInstance.get();
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const apiKey = (request.headers['x-api-key'] || request.headers['X-API-KEY']) as string;

    if (!apiKey) {
      throw new UnauthorizedException('API credential signature missing from header context.');
    }

    const userId = (request.headers['x-user-id'] || request.headers['X-USER_ID']) as string;
    
    const key = `apikey:${userId}`;

    const bankMetadata = await this.redisInstance.get(key);

    if (!bankMetadata) {
      throw new UnauthorizedException('Invalid API Key provided.');
    }

    request['bank'] = bankMetadata;

    return true;
  }
}