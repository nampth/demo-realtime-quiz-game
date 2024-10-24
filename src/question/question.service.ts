import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/CreateQuestion.dto';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>
    ) { }

    async createQuestion(createQuestionDto: CreateQuestionDto) {
        let question = new Question();
        question.question = createQuestionDto.question;
        question.options = createQuestionDto.options;
        question.answer = createQuestionDto.answer;
        question.game_id = createQuestionDto.game_id;
        question.score = createQuestionDto.score;
        question.duration = createQuestionDto.duration;
        question.order = createQuestionDto.order;
        return await this.questionRepository.save(question);
    }

    async getQuestionsByGameID(id: string) {
        return await this.questionRepository.find({
            where: {
                game_id: id
            }
        });
    }
}

