import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/CreateGame.dto';
import { Game } from './entities/game.entity';
import { GAME_STATUSES } from 'src/constants/statuses/game';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { TABLES } from 'src/constants/tables';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) { }

    async getGameByID(id: string) {
        return await this.gameRepository.findOneBy({ id: id });
    }

    async getGames() {
        return await this.gameRepository.find();
    }

    async createGame(createGameDto: CreateGameDto) {
        let game = new Game();
        game.name = createGameDto.name;
        game.description = createGameDto.description;
        game.status = GAME_STATUSES.PENDING;
        game.created_by = createGameDto.created_by;
        return await this.gameRepository.save(game);
    }

    async getGameByUserID(user_id: string) {
        let games = await this.gameRepository
            .findAndCount({
                where: {
                    created_by: Equal(user_id),
                    status: Equal(GAME_STATUSES.PENDING)
                }
            })
        return games;
    }

    async playGame(game_id: string, user_id: string) {
        let game = await this.getGameByID(game_id);
        if (!game || game.created_by != user_id || game.status != GAME_STATUSES.PENDING) {
            throw new BadRequestException("Invalid game");
        }
        game.status = GAME_STATUSES.PLAYING;
        return await this.gameRepository.save(game);
    }

    async resetGame() {
        await this.gameRepository.update(
            { status: Not(GAME_STATUSES.PENDING) },
            { status: GAME_STATUSES.PENDING }
        );

    }
}
