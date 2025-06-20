import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskNote } from './task-note.entity';

@Entity()
export class TaskNoteFile {
  @ApiProperty({ type: String, description: 'ID файла' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: 'ID заметки' })
  @Column()
  task_note_id: string;

  @ApiProperty({ description: 'Оригинальное имя файла' })
  @Column()
  filename: string;

  @ApiProperty({ description: 'Путь к файлу' })
  @Column()
  path: string;

  @ApiProperty({ description: 'MIME-тип' })
  @Column()
  mime_type: string;

  @ApiProperty({ type: Number, description: 'Размер файла (байт)' })
  @Column('bigint')
  size: number;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => TaskNote, (note) => note.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_note_id' })
  note: TaskNote;
} 