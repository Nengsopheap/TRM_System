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
      title1_en,
      title2_en,
      title1_kh,
      title2_kh,
      description_en,
      description_kh,
      content_en,
      content_kh,
      title_answer_en,
      title_answer_kh,
      title1_answer_en,
      title1_answer_kh,
      title2_answer_en,
      title2_answer_kh,
      tip3_en,
      tip3_kh,
      tip4_en,
      tip4_kh,
      tip5_en,
      tip5_kh,
      tip1_en,
      tip1_kh,
      tip2_en,
      tip2_kh,
      tip1_answer_en,
      tip1_answer_kh,
      tip2_answer_en,
      tip2_answer_kh,
      tip3_answer_en,
      tip3_answer_kh,
      tip4_answer_en,
      tip4_answer_kh,
      tip5_answer_en,
      tip5_answer_kh,
    } = createLessonDto;

    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessment_id },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');

    const lesson = this.lessonRepository.create({
      title_en,
      title_kh,
      title1_en,
      title2_en,
      title1_kh,
      title2_kh,
      description_en,
      description_kh,
      content_en,
      content_kh,
      title_answer_en,
      title_answer_kh,
      title1_answer_en,
      title1_answer_kh,
      title2_answer_en,
      title2_answer_kh,
      tip3_en,
      tip3_kh,
      tip4_en,
      tip4_kh,
      tip5_en,
      tip5_kh,
      tip1_en,
      tip1_kh,
      tip2_en,
      tip2_kh,
      tip1_answer_en,
      tip1_answer_kh,
      tip2_answer_en,
      tip2_answer_kh,
      tip3_answer_en,
      tip3_answer_kh,
      tip4_answer_en,
      tip4_answer_kh,
      tip5_answer_en,
      tip5_answer_kh,
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
