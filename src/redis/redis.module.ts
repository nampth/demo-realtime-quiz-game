import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global() // Mark only the provider as global
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                return new Redis({
                    host: 'localhost',
                    port: 6379,
                });
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT'], // Export REDIS_CLIENT as a global provider
})
export class RedisModule { }
