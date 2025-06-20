import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskNote } from '../../entities/task-note.entity';

@Injectable()
export class TaskNoteService {
  constructor(
    @InjectRepository(TaskNote)
    private taskNoteRepository: Repository<TaskNote>,
  ) {}

  async createOrUpdate(task_id: string, content: string): Promise<TaskNote> {
    let note = await this.taskNoteRepository.findOne({ where: { task_id } });
    if (note) {
      note.content = content;
      return this.taskNoteRepository.save(note);
    }
    note = this.taskNoteRepository.create({ task_id, content });
    return this.taskNoteRepository.save(note);
  }

  async findByTask(task_id: string): Promise<TaskNote | null> {
    return this.taskNoteRepository.findOne({ where: { task_id } });
  }
} 