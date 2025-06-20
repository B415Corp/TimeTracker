import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskNote } from '../../entities/task-note.entity';
import { TaskNoteService } from './task-note.service';
import { TaskNoteController } from './task-note.controller';
import { TaskNoteFile } from '../../entities/task-note-file.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskNote, TaskNoteFile]),
    MulterModule.register({ limits: { fileSize: 10 * 1024 * 1024 } }),
  ],
  providers: [TaskNoteService],
  controllers: [TaskNoteController],
  exports: [TaskNoteService],
})
export class TaskNoteModule {} 