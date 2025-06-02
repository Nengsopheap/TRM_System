import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title_en: string;
  title_kh: string;
  @IsString()
  title_answer_en?: string;
  title_answer_kh?: string;
  @IsInt()
  assessment_id: number;

  @IsOptional()
  @IsString()
  description_en?: string;
  description_kh?: string;

  @IsOptional()
  @IsString()
  content_en?: string;
  content_kh?: string;
}
