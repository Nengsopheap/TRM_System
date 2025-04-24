import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './Entity/course.entity';
import { Lesson } from 'src/lesson/entity/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course,Lesson])],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule {}
