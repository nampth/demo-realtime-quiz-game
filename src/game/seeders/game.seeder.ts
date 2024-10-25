import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameService } from '../game.service';
import { CreateGameDto } from '../dto/CreateGame.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameSeeder {
    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
    ) { }

    async seed() {
        let user = await this.userService.getUserByEmail("userA@gmail.com");
        let games = [
            { name: "History game", description: "Blah blah" },
            { name: "Math game", description: "Blah blah" },
            { name: "Culture game", description: "Blah" },
        ]
        games.forEach(async (game) => {
            let dto = new CreateGameDto();
            dto.name = game.name;
            dto.description = game.description;
            dto.created_by = user.id;
            await this.gameService.createGame(dto);
        })

    }
}