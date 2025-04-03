import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question_text: string;

  assessment_id: number; // Add assessment_id here
  @IsArray()
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
}
