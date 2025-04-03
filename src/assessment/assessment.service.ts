

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssessmentDto } from './dtos/create_assessment.dto';
import { Assessment } from './entity/assessment.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentsRepository: Repository<Assessment>,
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

  async update(
    id: number,
    updateAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    await this.assessmentsRepository.update(id, updateAssessmentDto);
    return await this.assessmentsRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.assessmentsRepository.delete(id);
  
    if (result.affected === 0) {
      throw new Error(`Assessment with ID ${id} not found`);
    }
  
    return { message: 'Assessment deleted successfully' };
  }
  
}
