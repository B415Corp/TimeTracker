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
import { DocumentBlock } from './document-block.entity';
import { User } from './user.entity';

@Entity('document_files')
export class DocumentFile {
  @ApiProperty({ type: String, description: 'Unique identifier for the file' })
  @PrimaryGeneratedColumn('uuid')
  file_id: string;

  @ApiProperty({ type: String, description: 'Document ID' })
  @Column()
  document_id: string;

  @ApiProperty({ type: String, description: 'Block ID (if file is attached to a block)', required: false })
  @Column({ nullable: true })
  block_id?: string;

  @ApiProperty({ type: String, description: 'Original filename' })
  @Column()
  filename: string;

  @ApiProperty({ type: String, description: 'File path on server' })
  @Column()
  path: string;

  @ApiProperty({ type: String, description: 'MIME type' })
  @Column()
  mime_type: string;

  @ApiProperty({ type: Number, description: 'File size in bytes' })
  @Column('bigint')
  size: number;

  @ApiProperty({ type: String, description: 'User ID who uploaded the file' })
  @Column()
  uploaded_by: string;

  @ApiProperty({ type: Date, description: 'Upload date' })
  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Document, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => DocumentBlock, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'block_id' })
  block?: DocumentBlock;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}
