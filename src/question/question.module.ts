import { Module } from '@nestjs/common';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { Question } from './entity/question.entity';
import { Option } from './entity/option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entity/submit_answer_entity';
import { Assessment } from './../assessment/entity/assessment.entity';
import { User } from 'src/users/entity/users.entity';
import { UserScore } from 'src/users/entity/user_score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Option, Answer, Assessment, User, UserScore]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionModule {}
