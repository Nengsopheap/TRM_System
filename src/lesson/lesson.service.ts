import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entity/lesson.entity';
import { Course } from 'src/course/Entity/course.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // src/lesson/lesson.service.ts
  async createLesson(title: string, course_id?: number): Promise<Lesson> {
    const lesson = this.lessonRepository.create({ title });

    if (course_id) {
      const course = await this.courseRepository.findOne({
        where: { id: course_id },
      });
      if (!course) throw new Error('Course not found');

      lesson.course = course;
    } else {
    }

    return this.lessonRepository.save(lesson);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async getLessonById(id: number): Promise<Lesson> {
    return this.lessonRepository.findOne({ where: { id } });
  }

  async updateLesson(id: number, title: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (lesson) {
      lesson.title = title;
      return this.lessonRepository.save(lesson);
    }
    return null;
  }

  async deleteLesson(id: number): Promise<void> {
    await this.lessonRepository.delete(id);
  }
}
