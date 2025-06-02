import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsController } from './assessment.controller';
import { AssessmentsService } from './assessment.service';
import { Assessment } from './entity/assessment.entity';
import { Answer } from 'src/question/entity/submit_answer_entity';
import { Lesson } from './../lesson/entity/lesson.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, Answer,Lesson])],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
})
export class AssessmentModule {}
