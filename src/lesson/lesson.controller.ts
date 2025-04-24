import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Lesson } from './entity/lesson.entity';
import { CreateLessonDto } from './dtos/create_lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonService.createLesson(
      createLessonDto.title,
      createLessonDto.course_id,
    );
  }

  @Get()
  async findAll(): Promise<Lesson[]> {
    return this.lessonService.getAllLessons();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Lesson> {
    return this.lessonService.getLessonById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
  ): Promise<Lesson> {
    return this.lessonService.updateLesson(id, title);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.lessonService.deleteLesson(id);
  }
}
