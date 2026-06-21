import { Injectable } from '@nestjs/common';
import { RedisInstance } from 'src/common/redis/redis.client';
import { randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

@Injectable()
export class ApikeyService {
    private readonly redisInstance = RedisInstance.get();
    private readonly algorithm = 'aes-256-gcm';
    private readonly ivLength = 12;
    private readonly key = process.env.API_KEY_SIGN_KEY || 'tempKey123';
    private readonly encoding = 'base64';

    private getKeyBuffer(): Buffer {
        const buffer = Buffer.from(this.key, this.encoding);
        if (buffer.length !== 32) {
            throw new Error('API_KEY_SIGN_KEY must be exactly 32 bytes (256 bits) when decoded from base64.');
        }
        return buffer;
    }

    async createKey(userId: number) {
        const key = `apikey:${userId}`;
        const hasKey = await this.redisInstance.get(key);

        if (!hasKey) {
            const newKey = this.generateKey();
            const keyBuffer = this.getKeyBuffer();
            const encryptedKey = this.encrypt(newKey, keyBuffer);
            // Key automatically expires in 7 days (604,800 seconds)
            await this.redisInstance.set(key, encryptedKey, { EX: 604800 });
            return { key: newKey };
        }
        
        return { key: hasKey };
    }

    private generateKey(): string {
        return randomBytes(32).toString('hex');
    }

    private encrypt(text: string, key: Buffer): string {
        const iv = randomBytes(this.ivLength);
        const cipher = createCipheriv(this.algorithm, key, iv);

        let encrypted = cipher.update(text, 'utf8', this.encoding);
        encrypted += cipher.final(this.encoding);

        const tag = cipher.getAuthTag().toString(this.encoding);

        return `${iv.toString(this.encoding)}:${tag}:${encrypted}`;
    }

    verifyKey(encryptedKey: string): boolean {
        try {
            const keyBuffer = this.getKeyBuffer();

            const [ivPart, tagPart, encryptedPart] = encryptedKey.split(':');
            if (!ivPart || !tagPart || !encryptedPart) {
                return false;
            }

            const iv = Buffer.from(ivPart, this.encoding);
            const tag = Buffer.from(tagPart, this.encoding);

            const decipher = createDecipheriv(this.algorithm, keyBuffer, iv);
            decipher.setAuthTag(tag);

            let decrypted = decipher.update(encryptedPart, this.encoding, 'utf8');
            
            decrypted += decipher.final('utf8');
            return true;
        } catch (error) {
            return false;
        }
    }
}