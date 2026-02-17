import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from './document.entity';
import { User } from './user.entity';

@Entity('document_versions')
export class DocumentVersion {
  @ApiProperty({ type: String, description: 'Unique identifier for the version' })
  @PrimaryGeneratedColumn('uuid')
  version_id: string;

  @ApiProperty({ type: String, description: 'Document ID' })
  @Column()
  document_id: string;

  @ApiProperty({ type: String, description: 'User ID who updated the document' })
  @Column()
  updated_by: string;

  @ApiProperty({ type: Date, description: 'Update timestamp' })
  @CreateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: String, description: 'Brief description of changes', required: false })
  @Column({ nullable: true, length: 500 })
  change_description?: string;

  // Relations
  @ManyToOne(() => Document, (document) => document.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'updated_by' })
  user: User;
}
