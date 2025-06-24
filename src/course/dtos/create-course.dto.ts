import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  assessmentId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  level?: string;  // e.g. beginner, intermediate, advanced

  @IsString()
  @IsOptional()
  course_url?: string;
}
