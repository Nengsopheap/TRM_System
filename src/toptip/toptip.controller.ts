// src/toptip/toptip.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ToptipService } from './toptip.service';
import { CreateToptipDto } from './dtos/create_totip.dto';

@Controller('toptip')
export class ToptipController {
  constructor(private readonly toptipService: ToptipService) {}

  @Post()
  create(@Body() createToptipDto: CreateToptipDto) {
    return this.toptipService.create(createToptipDto);
  }

  @Get()
  findAll() {
    return this.toptipService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: CreateToptipDto) {
    return this.toptipService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toptipService.remove(+id);
  }
}
