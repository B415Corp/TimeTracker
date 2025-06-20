import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors, UploadedFile, Res, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TaskNote } from '../../entities/task-note.entity';
import { TaskNoteService } from './task-note.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

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

  @ApiBearerAuth()
  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.taskNoteService.addFile(taskId, file);
  }

  @ApiBearerAuth()
  @Get('files')
  @UseGuards(JwtAuthGuard)
  async listFiles(@Param('taskId') taskId: string) {
    return this.taskNoteService.findFiles(taskId);
  }

  @ApiBearerAuth()
  @Get('files/:fileId')
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res() res,
  ) {
    const file = await this.taskNoteService.getFile(fileId);
    if (!file) return res.status(404).send();
    const filepath = join(process.cwd(), 'uploads', file.path);
    return res.download(filepath, file.filename);
  }

  @ApiBearerAuth()
  @Delete('files/:fileId')
  @UseGuards(JwtAuthGuard)
  async removeFile(@Param('fileId') fileId: string) {
    await this.taskNoteService.removeFile(fileId);
    return { success: true };
  }
} 