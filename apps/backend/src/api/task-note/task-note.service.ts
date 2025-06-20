import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskNote } from '../../entities/task-note.entity';
import { TaskNoteFile } from '../../entities/task-note-file.entity';
import { Express } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as fs from 'fs';

@Injectable()
export class TaskNoteService {
  constructor(
    @InjectRepository(TaskNote)
    private taskNoteRepository: Repository<TaskNote>,
    @InjectRepository(TaskNoteFile)
    private fileRepository: Repository<TaskNoteFile>,
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

  async addFile(task_id: string, file: Express.Multer.File): Promise<TaskNoteFile> {
    // Ensure note exists
    const note = await this.createOrUpdate(task_id, '');

    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir);

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(uploadDir, filename);
    await fs.promises.writeFile(filepath, file.buffer);

    const fileRecord = this.fileRepository.create({
      task_note_id: note.task_note_id,
      filename: file.originalname,
      path: filename,
      mime_type: file.mimetype,
      size: file.size,
    });
    return this.fileRepository.save(fileRecord);
  }

  findFiles(task_id: string) {
    return this.fileRepository
      .createQueryBuilder('file')
      .innerJoin('file.note', 'note')
      .where('note.task_id = :task_id', { task_id })
      .getMany();
  }

  async getFile(id: string): Promise<TaskNoteFile | null> {
    return this.fileRepository.findOneBy({ id });
  }

  async removeFile(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
} 