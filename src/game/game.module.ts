import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Game } from './entities/game.entity';
import { JwtService } from '@nestjs/jwt';
import { EventsGateway } from 'src/event/events.gateway';
import { QuestionService } from 'src/question/question.service';
import { Question } from 'src/question/entities/question.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User, Question]),
  ],
  controllers: [GameController],
  providers: [GameService, UserService, JwtService, EventsGateway, QuestionService, RedisService]
})
export class GameModule { }
