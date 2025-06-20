import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TaskNote } from '../../entities/task-note.entity';
import { TaskNoteService } from './task-note.service';

class UpdateTaskNoteDto {
  content: string;
}

@ApiTags('task-note')
@Controller('tasks/:taskId/note')
export class TaskNoteController {
  constructor(private readonly taskNoteService: TaskNoteService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TaskNote })
  @ApiOperation({ summary: 'Получить заметку задачи' })
  @Get()
  async getNote(@Param('taskId') taskId: string) {
    return this.taskNoteService.findByTask(taskId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TaskNote })
  @ApiOperation({ summary: 'Создать/обновить заметку задачи' })
  @Post()
  async createOrUpdate(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskNoteDto,
  ) {
    return this.taskNoteService.createOrUpdate(taskId, dto.content);
  }
} 