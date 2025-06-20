import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Paginate, PaginationParams } from 'src/decorators/paginate.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Notes } from 'src/entities/notes.entity';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';

@ApiTags('task-notes')
@Controller('tasks/:taskId/notes')
export class TaskNotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: Notes })
  @ApiOperation({ summary: 'Create new note for task' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('taskId') taskId: string,
    @Body() createNotesDto: CreateNotesDto,
    @GetUser() user: User,
  ): Promise<Notes> {
    return this.notesService.createForTask(createNotesDto, user.user_id, taskId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: Notes, isArray: true })
  @ApiOperation({ summary: 'Get all task notes' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @UseGuards(JwtAuthGuard)
  @Get()
  @Paginate()
  async findAll(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
    @PaginationParams() paginationQuery: PaginationQueryDto,
  ) {
    return this.notesService.findAllByTask(user.user_id, taskId, paginationQuery);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: Notes })
  @ApiOperation({ summary: 'Get note by id for task' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Notes> {
    return this.notesService.findOneByTask(id, user.user_id, taskId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: Notes })
  @ApiOperation({ summary: 'Update note by id for task' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @Body() updateNotesDto: UpdateNotesDto,
  ): Promise<Notes> {
    // Убедимся, что task_id совпадает с param
    return this.notesService.update(id, { ...updateNotesDto, task_id: taskId });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: Notes })
  @ApiOperation({ summary: 'Delete note by id for task' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(id);
  }
} 