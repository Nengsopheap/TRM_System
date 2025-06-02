import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Lesson } from './entity/lesson.entity';
import { CreateLessonDto } from './dtos/create_lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Get()
  async findAll(): Promise<Lesson[]> {
    return this.lessonService.getAllLessons();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
    return this.lessonService.getLessonById(id);
  }

    // Endpoint to get lessons by assessmentId
  @Get('assessment/:assessmentId')
  async getLessonsByAssessmentId(@Param('assessmentId') assessmentId: number) {
    return await this.lessonService.getLessonsByAssessmentId(assessmentId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateLessonDto>,
  ): Promise<Lesson> {
    return this.lessonService.updateLesson(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.lessonService.deleteLesson(id);
  }
}
