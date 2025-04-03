// src/assessments/dto/create-assessment.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  parent_id: number | null;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}
