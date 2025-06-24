import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entity/course.entity';
import { Lesson } from 'src/lesson/entity/lesson.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course,Lesson,Assessment])],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule {}
