import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Project } from './project.entity';
import { DocumentBlock } from './document-block.entity';
import { DocumentMember } from './document-member.entity';
import { DocumentFieldValue } from './document-field-value.entity';
import { DocumentComment } from './document-comment.entity';
import { DocumentVersion } from './document-version.entity';
import { Task } from './task.entity';

@Entity('documents')
export class Document {
  @ApiProperty({ type: String, description: 'Unique identifier for the document' })
  @PrimaryGeneratedColumn('uuid')
  document_id: string;

  @ApiProperty({ type: String, description: 'Project ID associated with the document' })
  @Column()
  project_id: string;

  @ApiProperty({ type: String, description: 'Parent document ID for hierarchy', required: false })
  @Column({ nullable: true })
  parent_document_id?: string;

  @ApiProperty({ type: String, description: 'Title of the document' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ type: String, description: 'Icon (emoji or URL)', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ type: String, description: 'Cover image URL', required: false })
  @Column({ nullable: true })
  cover_image?: string;

  @ApiProperty({ type: String, description: 'User ID who created the document' })
  @Column()
  created_by: string;

  @ApiProperty({ type: String, description: 'User ID who last updated the document', required: false })
  @Column({ nullable: true })
  updated_by?: string;

  @ApiProperty({ type: Date, description: 'Creation date of the document' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Last update date of the document' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Document, (document) => document.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_document_id' })
  parent?: Document;

  @OneToMany(() => Document, (document) => document.parent)
  children: Document[];

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updater?: User;

  @OneToMany(() => DocumentBlock, (block) => block.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blocks: DocumentBlock[];

  @OneToMany(() => DocumentMember, (member) => member.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  members: DocumentMember[];

  @OneToMany(() => DocumentFieldValue, (fieldValue) => fieldValue.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  customFieldValues: DocumentFieldValue[];

  @OneToMany(() => DocumentComment, (comment) => comment.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: DocumentComment[];

  @OneToMany(() => DocumentVersion, (version) => version.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  versions: DocumentVersion[];

  @OneToMany(() => Task, 'document_id')
  tasks: Task[];
}
