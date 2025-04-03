import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssessmentDto } from './dtos/create_assessment.dto';
import { Assessment } from './entity/assessment.entity';
import { Answer } from 'src/question/entity/submit_answer_entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentsRepository: Repository<Assessment>,

    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>, // Inject Answers Repository
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    const assessment = this.assessmentsRepository.create(createAssessmentDto);
    return await this.assessmentsRepository.save(assessment);
  }

  async findAll(): Promise<Assessment[]> {
    return await this.assessmentsRepository.find();
  }

  async findOne(id: number): Promise<Assessment> {
    return await this.assessmentsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    await this.assessmentsRepository.update(id, updateAssessmentDto);
    return await this.assessmentsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.assessmentsRepository.delete(id);
  
    if (result.affected === 0) {
      throw new Error(`Assessment with ID ${id} not found`);
    }
  
    return { message: 'Assessment deleted successfully' };
  }

  // ✅ Add Score Calculation
  async calculateScore(assessment_id: number): Promise<number> {
    const answers = await this.answersRepository.find({
      relations: ['question', 'question.assessment'],
    });

    // Calculate the total score for the given assessment
    const score = answers
      .filter((answer) => answer.is_correct && answer.question.assessment.id === assessment_id)
      .reduce((total, answer) => total + (answer.question.points || 0), 0); // Ensure points exist

    return score;
  }
}
