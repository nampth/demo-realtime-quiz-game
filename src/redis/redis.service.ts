import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) { }

    // Save data to Redis
    async saveData(key: string, value: any): Promise<string> {
        return this.redisClient.set(key, JSON.stringify(value));
    }

    // Retrieve data from Redis
    async getData(key: string): Promise<any> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    // Delete data from Redis
    async deleteData(key: string): Promise<number> {
        return this.redisClient.del(key);
    }
}
