import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from './file.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => File, (file) => file.note)
  files: File[];
} 