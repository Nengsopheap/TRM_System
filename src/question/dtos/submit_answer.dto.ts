import { IsInt, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
    question_id: number;
    option_id: number;
}
