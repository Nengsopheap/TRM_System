import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question_text: string;

  @IsNotEmpty()
  @IsNumber()
  assessment_id: number;

  @IsArray()
  @IsNotEmpty()
  options: {
    option_text: string;
    is_correct: boolean;
  }[];

  @IsNumber()
  points?: number;

  @IsBoolean()
  is_multiple_choice?: boolean;

   @IsBoolean()
  @IsOptional()
  is_yes_no?: boolean;
}
