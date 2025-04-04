import { IsArray, IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

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

  // @IsBoolean()
  // is_multiple_choice?: boolean;
}
