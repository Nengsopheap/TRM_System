// src/toptip/dto/create-toptip.dto.ts
import { IsString } from 'class-validator';

export class CreateToptipDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
