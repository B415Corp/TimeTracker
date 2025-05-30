import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notes } from '../../entities/notes.entity.js';
import { CreateNotesDto } from './dto/create-notes.dto.js';
import { UpdateNotesDto } from './dto/update-notes.dto.js';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto.js';

@Injectable()
export class NotesService {
  private readonly MAX_NESTING_LEVEL = 10;

  @InjectRepository(Notes)
  private notesRepository: Repository<Notes>;

  async create(note: CreateNotesDto, user_id: string): Promise<Notes> {
    // Валидация вложенности
    if (note.parent_note_id) {
      await this.validateNesting(note.parent_note_id, user_id, note.nesting_level || 0);
    }

    // Автоматически вычисляем уровень вложенности если не указан
    let nestingLevel = note.nesting_level || 0;
    if (note.parent_note_id && nestingLevel === 0) {
      const parentNote = await this.findOne(note.parent_note_id, user_id);
      nestingLevel = (parentNote.nesting_level || 0) + 1;
    }

    // Вычисляем order, если не передан
    let order = note.order;
    if (order === undefined) {
      const siblings = await this.notesRepository.find({
        where: { parent_note_id: note.parent_note_id ?? null, user_id },
        select: ['order'],
      });
      order = siblings.length > 0 ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0;
    }

    const newNote = this.notesRepository.create({ 
      ...note, 
      user_id,
      nesting_level: nestingLevel,
      order,
    });
    return this.notesRepository.save(newNote);
  }

  async findAll(user_id: string, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await this.notesRepository.findAndCount({
      where: { user_id },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['parentNote', 'childNotes', 'task'],
      select: {
        notes_id: true,
        text_content: true,
        parent_note_id: true,
        task_id: true,
        nesting_level: true,
        created_at: true,
        updated_at: true,
        parentNote: {
          notes_id: true,
        },
        task: {
          task_id: true,
        }
      },
    });

    return [data, total];
  }

  async findOne(notes_id: string, user_id: string): Promise<Notes> {
    const note = await this.notesRepository.findOne({
      where: { notes_id, user_id },
      relations: ['parentNote', 'childNotes', 'task'],
      select: {
        notes_id: true,
        text_content: true,
        parent_note_id: true,
        task_id: true,
        nesting_level: true,
        created_at: true,
        updated_at: true,
        parentNote: {
          notes_id: true,
        },
        childNotes: {
          notes_id: true,
          nesting_level: true,
        },
        task: {
          task_id: true,
        }
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async findByTask(task_id: string, user_id: string): Promise<Notes[]> {
    return this.notesRepository.find({
      where: { task_id, user_id },
      order: { created_at: 'DESC' },
      relations: ['childNotes'],
    });
  }

  async findNoteHierarchy(notes_id: string, user_id: string): Promise<Notes> {
    const note = await this.notesRepository.findOne({
      where: { notes_id, user_id },
      relations: ['parentNote', 'childNotes', 'childNotes.childNotes'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(notes_id: string, updateData: UpdateNotesDto): Promise<Notes> {
    const existingNote = await this.notesRepository.findOne({
      where: { notes_id },
    });

    if (!existingNote) {
      throw new NotFoundException('Note not found');
    }

    // Валидация вложенности при изменении родительской заметки
    if (updateData.parent_note_id && updateData.parent_note_id !== existingNote.parent_note_id) {
      await this.validateNesting(
        updateData.parent_note_id, 
        existingNote.user_id, 
        updateData.nesting_level || existingNote.nesting_level
      );
      // Проверяем, что заметка не становится родителем самой себе (прямо или косвенно)
      await this.validateCircularReference(notes_id, updateData.parent_note_id);
    }

    // Если order не передан, оставляем старый
    if (updateData.order === undefined) {
      updateData.order = existingNote.order;
    }

    await this.notesRepository.update(notes_id, updateData);
    return this.notesRepository.findOne({
      where: { notes_id },
      relations: ['parentNote', 'childNotes', 'task'],
    });
  }

  async remove(id: string): Promise<void> {
    // При удалении заметки, дочерние заметки автоматически удалятся благодаря cascade
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Note not found');
    }
  }

  private async validateNesting(parent_note_id: string, user_id: string, nestingLevel: number): Promise<void> {
    if (nestingLevel >= this.MAX_NESTING_LEVEL) {
      throw new BadRequestException(`Maximum nesting level is ${this.MAX_NESTING_LEVEL}`);
    }

    const parentNote = await this.notesRepository.findOne({
      where: { notes_id: parent_note_id, user_id },
    });

    if (!parentNote) {
      throw new NotFoundException('Parent note not found');
    }

    if ((parentNote.nesting_level || 0) + 1 >= this.MAX_NESTING_LEVEL) {
      throw new BadRequestException(`Adding child note would exceed maximum nesting level of ${this.MAX_NESTING_LEVEL}`);
    }
  }

  private async validateCircularReference(notes_id: string, parent_note_id: string): Promise<void> {
    // Проверяем, что parent_note_id не является потомком notes_id
    const visited = new Set<string>();
    let currentParentId = parent_note_id;

    while (currentParentId && !visited.has(currentParentId)) {
      if (currentParentId === notes_id) {
        throw new BadRequestException('Cannot create circular reference in note hierarchy');
      }

      visited.add(currentParentId);

      const parent = await this.notesRepository.findOne({
        where: { notes_id: currentParentId },
        select: ['parent_note_id'],
      });

      currentParentId = parent?.parent_note_id;
    }
  }
}
