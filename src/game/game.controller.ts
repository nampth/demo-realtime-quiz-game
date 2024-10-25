import { Controller, Delete, Get, Inject, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { TABLES } from 'src/constants/tables';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventsGateway } from 'src/event/events.gateway';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRandomNumber } from 'src/common/helpers/number.helpers';
import { API_STATUSES } from 'src/constants/statuses/api';
import { GAME_STATES } from 'src/constants/states';
import { GameType } from 'src/common/types/game';
import { QuestionService } from 'src/question/question.service';
import { RedisService } from 'src/redis/redis.service';

// @UseGuards(JwtAuthGuard)
@ApiTags(TABLES.GAME)
@Controller('game')
export class GameController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly userServices: UserService,
        private readonly gameServices: GameService,
        private readonly eventsGateway: EventsGateway,
        private readonly redisService: RedisService
    ) { }

    @Get('/')
    @ApiOperation({ summary: 'Fetch available games' })
    async getGames(@Req() req: any, @Query('email') email: string): Promise<any> {
        const user = await this.userServices.getUserByEmail(email);
        return await this.gameServices.getGameByUserID(user?.id);
    }

    @Delete('/reset')
    @ApiOperation({ summary: 'Choose a game' })
    async resetGame(@Req() req: any,) {
        await this.redisService.saveData(GAME_STATES.ROOMS, [])
        await this.gameServices.resetGame();
        return {
            status: API_STATUSES.SUCCESS
        }
    }

    @Put('/play/:game_id')
    @ApiOperation({ summary: 'Choose a game' })
    async playGame(@Req() req: any, @Param('game_id') game_id: string, @Query('email') email: string) {
        const user = await this.userServices.getUserByEmail(email);
        const game = await this.gameServices.playGame(game_id, user.id);
        let roomId = getRandomNumber(1e6, 1e7);

        let questions = await this.questionService.getQuestionsByGameID(game.id);
        let rooms = await this.redisService.getData(GAME_STATES.ROOMS);
        let newGame = <GameType>{
            room_id: roomId,
            questions: questions,
            current_index: -1,
            answer: [],
            players: []
        };
        if (rooms) {
            rooms.push(newGame);
        } else {
            rooms = [newGame];
        }
        await this.redisService.saveData(GAME_STATES.ROOMS, rooms)
        return {
            status: API_STATUSES.SUCCESS,
            room: roomId
        }
    }
}
