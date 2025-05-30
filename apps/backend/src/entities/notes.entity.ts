import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
@Index(['parent_note_id'])
export class Notes {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the note',
  })
  @PrimaryGeneratedColumn('uuid')
  notes_id: string;

  @ApiProperty({
    type: String,
    description: 'User ID associated with the note',
  })
  @Column({ default: '11111111-1111-1111-1111-111111111111' })
  user_id: string;

  @ApiProperty({
    type: 'object',
    description: 'JSON-структура заметки (массив блоков)',
  })
  @Column('json', { nullable: false, default: () => "'[]'" })
  text_content: any;

  @ApiProperty({
    type: String,
    description: 'Parent note ID for nested notes',
    required: false,
  })
  @Column({ nullable: true })
  parent_note_id: string;

  @ApiProperty({
    type: Number,
    description: 'Nesting level to prevent infinite recursion',
  })
  @Column({ default: 0 })
  nesting_level: number;

  @ApiProperty({
    type: String,
    description: 'Task ID if note is linked to a task',
    required: false,
  })
  @Column({ nullable: true })
  task_id: string;

  @ApiProperty({
    type: Number,
    description: 'Порядок строки внутри родителя',
    required: false,
  })
  @Column({ nullable: false, default: 0 })
  order: number;

  @ApiProperty({ type: Date, description: 'Creation date of the note' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Last update date of the note' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({
    type: () => User,
    description: 'User associated with the note',
  })
  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    type: () => Notes,
    description: 'Parent note for nested structure',
    required: false,
  })
  @ManyToOne(() => Notes, (note) => note.childNotes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_note_id' })
  parentNote: Notes;

  @ApiProperty({
    type: () => [Notes],
    description: 'Child notes for nested structure',
  })
  @OneToMany(() => Notes, (note) => note.parentNote, {
    cascade: true,
  })
  childNotes: Notes[];

  @ApiProperty({
    type: () => Task,
    description: 'Task associated with the note',
    required: false,
  })
  @ManyToOne(() => Task, (task) => task.notes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
