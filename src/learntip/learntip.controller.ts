// src/learntip/learntip.controller.ts
import { Controller, Get, Post, Body, Param , Put, Delete } from '@nestjs/common';
import { LearnTipService } from './learntip.service';
import { CreateLearnTipDto } from './dtos/create_learntip.dto';
import { ToptipService } from '../toptip/toptip.service';

@Controller('learntip')
export class LearnTipController {
  constructor(private readonly learnTipService: LearnTipService) {}

  @Post()
  create(@Body() dto: CreateLearnTipDto) {
    return this.learnTipService.create(dto);
  }

  @Get()
  findAll() {
    return this.learnTipService.findAll();
  }

  @Get('by-toptip/:id')
  findByToptip(@Param('id') id: string) {
    return this.learnTipService.findByToptipId(+id);
  }

  // Update LearnTip by ID
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateLearnTipDto
  ) {
    return this.learnTipService.update(+id, dto);
  }

  // Delete LearnTip by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learnTipService.remove(+id);
  }
}
