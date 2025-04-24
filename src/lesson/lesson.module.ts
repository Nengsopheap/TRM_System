import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { Course } from 'src/course/Entity/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Course])],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
