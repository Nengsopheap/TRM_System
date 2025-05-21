// src/learntip/dto/create-learntip.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateLearnTipDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  case: string;

  @IsInt()
  toptipId: number;
}
