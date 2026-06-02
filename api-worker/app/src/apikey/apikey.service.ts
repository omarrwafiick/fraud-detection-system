import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { RedisInstance } from 'src/common/redis/redis.client';

@Injectable()
export class ApikeyService {
    private readonly redisInstance = RedisInstance.get();
    async createKey(userId: number){
        const key = `apikey:${userId}`;
        const hasKey = await this.redisInstance.get(key);

        if(!hasKey){
            const newKey = this.generateKey();
            // Key will automatically expire in 7 days (604,800 seconds)
            await this.redisInstance.set(key, newKey, { EX: 604800 });
            return { key: newKey };
        }
        
        return { key: hasKey }
    }

    private generateKey(){
        return randomBytes(32).toString('hex');
    }
}
