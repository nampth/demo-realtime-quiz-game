import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Game } from './entities/game.entity'; 
import { JwtService } from '@nestjs/jwt';
import { EventsGateway } from 'src/event/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User]),
  ],
  controllers: [GameController],
  providers: [GameService, UserService, JwtService, EventsGateway]
})
export class GameModule { }
