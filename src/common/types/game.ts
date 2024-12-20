import { Question } from "src/question/entities/question.entity"
import { AnswerType } from "./answer"
import { User } from "src/user/entities/user.entity"
import { PlayerType } from "./player"

export type GameType = {
    room_id: number,
    questions: Question[],
    current_index: -1,
    answers: AnswerType[],
    players: PlayerType[],
    question_start_time: String,
    question_end_time: String,
}