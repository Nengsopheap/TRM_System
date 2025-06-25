import { Body, Controller, Post, Get, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './question.service';
import { CreateQuestionDto } from './dtos/create_question.dto';
import { SubmitAnswerDto } from './dtos/submit_answer.dto';
import { Question } from './entity/question.entity';
import { User } from 'src/users/entity/users.entity';
import { UserQuizAttempt } from './entity/UserQuizAttempt.entity';

import { UsePipes, ValidationPipe } from '@nestjs/common';
// import { User } from 'src/users/entity/users.entity';

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

  async updateQuestion(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateQuestionDto>,
  ): Promise<Question> {
    return this.questionsService.updateQuestion(id, updateData);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number): Promise<{ message: string }> {
    return this.questionsService.deleteQuestion(id);
  }
  // Endpoint for submitting the answer
  @Post('submit-answer')
  async submitAnswerBatch(
    @Body()
    body: { question_id: number; option_ids: number[]; user_id: number }[],
  ) {
    return this.questionsService.submitAnswersBatch(body);
  }

  // New endpoint for finding all submitted answers
  @Get('all')
  async findAllSubmitAnswers(): Promise<any[]> {
    return this.questionsService.findAllSubmitAnswers();
  }

  @Get('quiz-attempts')
async getAllUserQuizAttempts(): Promise<UserQuizAttempt[]> {
  return this.questionsService.getAllUserQuizAttempts();
}

  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionsService.getAllQuestions();
  }
  @Get('/:assessment_id')
  async getQuestionByAssessmentId(
    @Param('assessment_id') assessment_id: number,
  ): Promise<Question[]> {
    return this.questionsService.getQuestionByAssessmentId(assessment_id);
  }
}
