import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Note } from './note.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  storageKey: string;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => Note, (note) => note.files, { onDelete: 'CASCADE' })
  note: Note;
} 