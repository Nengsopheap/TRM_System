import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entity/lesson.entity';
import { Assessment } from '../assessment/entity/assessment.entity';
import { CreateLessonDto } from './dtos/create_lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const {
      assessment_id,
      title_en,
      title_kh,
      description_en,
      description_kh,
      content_en,
      content_kh,
      title_answer_en,
      title_answer_kh,
    } = createLessonDto;

    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessment_id },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');

    const lesson = this.lessonRepository.create({
      title_en,
      title_kh,
      description_en,
      description_kh,
      content_en,
      content_kh,
      title_answer_en,
      title_answer_kh,
      assessment,
    });

    return this.lessonRepository.save(lesson);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find({ relations: ['assessment'] });
  }

  async getLessonById(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['assessment'],
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async getLessonsByAssessmentId(assessmentId: number): Promise<Lesson[]> {
  const lessons = await this.lessonRepository.find({
    where: {
      assessment: { id: assessmentId },
    },
    relations: ['assessment'],
  });

  if (!lessons || lessons.length === 0) {
    throw new NotFoundException(`No lessons found for Assessment with ID ${assessmentId}`);
  }

  return lessons;
}


  async updateLesson(
    id: number,
    updateData: Partial<CreateLessonDto>,
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['assessment'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    Object.assign(lesson, updateData);
    return this.lessonRepository.save(lesson);
  }

  async deleteLesson(id: number): Promise<void> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    await this.lessonRepository.delete(id);
  }
}
