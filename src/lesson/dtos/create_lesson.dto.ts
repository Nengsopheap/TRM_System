import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title_en: string;
  title_kh: string;

  @IsOptional()
  title1_en?: string;
  title1_kh?: string;

  @IsString()
  title2_en?: string;
  title2_kh?: string;

  @IsString()
  title_answer_en?: string;
  title_answer_kh?: string;

  @IsString()
  title1_answer_en?: string;
  title1_answer_kh?: string;

  @IsString()
  title2_answer_en?: string;
  title2_answer_kh?: string;

  @IsString()
  tip1_en?: string;
  tip1_kh?: string;
  @IsString()
  tip2_en?: string;
  tip2_kh?: string;
  @IsString()
  tip3_en?: string;
  tip3_kh?: string;
  @IsString()
  tip4_en?: string;
  tip4_kh?: string;
  @IsString()
  tip5_en?: string;
  tip5_kh?: string;

  @IsString()
  tip1_answer_en?: string;
  tip1_answer_kh?: string;
  @IsString()
  tip2_answer_en?: string;
  tip2_answer_kh?: string;
  @IsString()
  tip3_answer_en?: string;
  tip3_answer_kh?: string;
  @IsString()
  tip4_answer_en?: string;
  tip4_answer_kh?: string;
  @IsString()
  tip5_answer_en?: string;
  tip5_answer_kh?: string;

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
