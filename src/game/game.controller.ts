import { Controller, Get, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { TABLES } from 'src/constants/tables';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventsGateway } from 'src/event/events.gateway';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRandomNumber } from 'src/common/helpers/number.helpers';
import { API_STATUSES } from 'src/constants/statuses/api';

@UseGuards(JwtAuthGuard)
@ApiTags(TABLES.GAME)
@Controller('game')
export class GameController {
    constructor(
        private readonly userServices: UserService,
        private readonly gameServices: GameService,
        private readonly eventsGateway: EventsGateway,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @Get('/')
    @ApiOperation({ summary: 'Fetch available games' })
    async getGames(@Req() req: any): Promise<any> {
        console.log(req.user);
        return await this.gameServices.getGameByUserID(req.user.id);
    }

    @Put('/play/:game_id')
    @ApiOperation({ summary: 'Choose a game' })
    async playGame(@Req() req: any, @Param('game_id') game_id: string) {
        const game = await this.gameServices.playGame(game_id, req.user.id);
        let roomId = getRandomNumber(1e6, 1e7);
        await this.cacheManager.set('active_game', roomId);

        return {
            status: API_STATUSES.SUCCESS,
            room: roomId
        }
    }
}
