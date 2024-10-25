import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { RedisService } from 'src/redis/redis.service';

@Module({
    providers: [EventsGateway, RedisService],
})
export class EventModule { }
