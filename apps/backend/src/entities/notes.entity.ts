import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Notes {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the client',
  })
  @PrimaryGeneratedColumn('uuid')
  notes_id: string;

  @ApiProperty({ type: String, description: 'Name of the client' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    type: String,
    description: 'User ID associated with the client',
  })
  @Column({ default: '11111111-1111-1111-1111-111111111111' })
  user_id: string;


  @ApiProperty({
    type: String,
    description: 'Contact information of the client',
  })
  @Column({ nullable: true })
  text_content: string;

  @ApiProperty({ type: Date, description: 'Creation date of the client' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Last update date of the client' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({
    type: () => User,
    description: 'User associated with the client',
  })
  @ManyToOne(() => User, (user) => user.clients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: String, description: 'Task ID associated with the note', required: false })
  @Column({ nullable: true })
  task_id?: string;

  @ApiProperty({ type: () => Task, description: 'Task associated with the note', required: false })
  @ManyToOne(() => Task, (task) => task.notes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task?: Task;
}
