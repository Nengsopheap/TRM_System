import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { Assessment } from 'src/assessment/entity/assessment.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { title, assessmentId, description, level, course_url } = createCourseDto;

    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const course = this.courseRepository.create({
      title,
      assessment,
      description,
      level: level || 'beginner',
      course_url,
      is_active: true,
    });

    return this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDto: Partial<CreateCourseDto>) {
  const course = await this.courseRepository.findOne({ where: { id } });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  if (updateCourseDto.assessmentId) {
    const assessment = await this.assessmentRepository.findOne({
      where: { id: updateCourseDto.assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    course.assessment = assessment;
  }

  Object.assign(course, updateCourseDto);
  return this.courseRepository.save(course);
}


  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: number) {
    return this.courseRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }
}
