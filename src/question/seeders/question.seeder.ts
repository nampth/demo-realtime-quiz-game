import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { CreateQuestionDto } from '../dto/CreateQuestion.dto';
import { getRandomNumber } from 'src/common/helpers/number.helpers';
import { QuestionService } from '../question.service';

@Injectable()
export class QuestionSeeder {
    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly questionService: QuestionService,
    ) { }

    async seed() {
        let options = [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
        ]
        let user = await this.userService.getUserByEmail("userA@gmail.com");
        let games = await this.gameService.getGameByUserID(user.id);

        games[0].forEach(async (game) => {
            for (let j = 0; j < 10; j++) {
                let dto = new CreateQuestionDto();
                dto.question = "Choose 1 option";
                dto.options = JSON.stringify(options);
                dto.answer = getRandomNumber(0, 3);
                dto.game_id = game.id;
                dto.score = getRandomNumber(10, 100);
                dto.duration = getRandomNumber(15, 30);
                dto.order = j;
                await this.questionService.createQuestion(dto);
            }
        });

    }
}