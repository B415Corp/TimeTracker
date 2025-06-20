import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskNote {
  @ApiProperty({ type: String, description: 'Идентификатор заметки задачи' })
  @PrimaryGeneratedColumn('uuid')
  task_note_id: string;

  @ApiProperty({ type: String, description: 'ID задачи' })
  @Column({ unique: true })
  task_id: string;

  @ApiProperty({ description: 'Содержимое заметки в формате JSON tiptap' })
  @Column('text')
  content: string;

  @ApiProperty({ type: Date, description: 'Дата создания' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Дата обновления' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Task, (task) => task.note, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;
} 