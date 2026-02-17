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
import { Document } from './document.entity';
import { DocumentBlock } from './document-block.entity';
import { User } from './user.entity';

@Entity('document_comments')
export class DocumentComment {
  @ApiProperty({ type: String, description: 'Unique identifier for the comment' })
  @PrimaryGeneratedColumn('uuid')
  comment_id: string;

  @ApiProperty({ type: String, description: 'Document ID (for document-level comments)', required: false })
  @Column({ nullable: true })
  document_id?: string;

  @ApiProperty({ type: String, description: 'Block ID (for block-level comments)', required: false })
  @Column({ nullable: true })
  block_id?: string;

  @ApiProperty({ type: String, description: 'User ID who created the comment' })
  @Column()
  user_id: string;

  @ApiProperty({ type: String, description: 'Comment content' })
  @Column('text')
  content: string;

  @ApiProperty({ type: String, description: 'Parent comment ID (for nested replies)', required: false })
  @Column({ nullable: true })
  parent_comment_id?: string;

  @ApiProperty({ type: Date, description: 'Creation date of the comment' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Last update date of the comment' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Document, (document) => document.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document?: Document;

  @ManyToOne(() => DocumentBlock, (block) => block.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'block_id' })
  block?: DocumentBlock;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DocumentComment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parent?: DocumentComment;

  @OneToMany(() => DocumentComment, (comment) => comment.parent)
  replies: DocumentComment[];
}
