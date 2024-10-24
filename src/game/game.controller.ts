import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { TABLES } from 'src/constants/tables';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags(TABLES.GAME)
@Controller('game')
export class GameController {
    constructor(
        private readonly userServices: UserService,
        private readonly gameServices: GameService
    ) { }

    @Get('/')
    @ApiOperation({ summary: 'Fetch available games' })
    async getGames(@Req() req: any): Promise<any> {
        return await this.gameServices.getGameByUserID(req.user.id);
    }

    @Put('/play/:game_id')
    @ApiOperation({ summary: 'Choose a game' })
    async playGame(@Req() req: any, @Param('game_id') game_id: string) {
        await this.gameServices.playGame(game_id, req.user.id);
    }
}
