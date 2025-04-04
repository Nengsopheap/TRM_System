import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsController } from './assessment.controller';
import { AssessmentsService } from './assessment.service';
import { Assessment } from './entity/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment])],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
})
export class AssessmentModule {}
