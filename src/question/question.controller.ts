import { Body, Controller, Post } from '@nestjs/common';
import { QuestionsService } from './question.service';
import { CreateQuestionDto } from './dtos/create_question.dto';
import { SubmitAnswerDto } from './dtos/submit_answer.dto';
import { Question } from './entity/question.entity';

import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }
  // Endpoint for submitting the answer
  @Post('submit-answer')
  async submitAnswer(
    @Body() body: { question_id: number; option_id: number },
  ): Promise<any> {
    const { question_id, option_id } = body;
    return this.questionsService.submitAnswer(question_id, option_id);
  }
}
