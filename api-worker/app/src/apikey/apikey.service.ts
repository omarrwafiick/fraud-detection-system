import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { RedisInstance } from 'src/shared/redis/redis.client';

@Injectable()
export class ApikeyService {
    private readonly redisInstance = RedisInstance.get();
    async createKey(userId: string){
        const key = `apikey:${userId}`;
        const hasKey = await this.redisInstance.get(key);

        if(!hasKey){
            const newKey = this.generateKey();
            await this.redisInstance.set(key, newKey);
            return { key: newKey };
        }
        
        return { key: hasKey }
    }

    private generateKey(){
        return randomBytes(32).toString('hex');
    }
}
