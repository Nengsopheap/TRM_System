import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AssessmentsService } from './assessment.service';
import { CreateAssessmentDto } from './dtos/create_assessment.dto';
import { Assessment } from './entity/assessment.entity';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  async create(
    @Body() createAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    try {
      return await this.assessmentsService.create(createAssessmentDto);
    } catch (error) {
      // Handle any service errors
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Assessment[]> {
    try {
      return await this.assessmentsService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Assessment> {
    try {
      return await this.assessmentsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    try {
      return await this.assessmentsService.update(id, updateAssessmentDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return await this.assessmentsService.remove(id);
  }
  @Get(':assessment_id/score')
  async getScore(@Param('assessment_id', ParseIntPipe) assessment_id: number) {
    return { total_score: await this.assessmentsService.calculateScore(assessment_id) };
  }
}
