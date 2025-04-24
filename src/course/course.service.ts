// src/course/course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './Entity/course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
// import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  findAll() {
    return this.courseRepository.find({ relations: ['lessons'] });
  }

  findOne(id: number) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
  }

  //   update(id: number, updateCourseDto: UpdateCourseDto) {
  //     return this.courseRepository.update(id, updateCourseDto);
  //   }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }
}
