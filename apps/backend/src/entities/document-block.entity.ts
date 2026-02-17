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
import { BlockType } from '../common/enums/block-type.enum';
import { DocumentComment } from './document-comment.entity';

@Entity('document_blocks')
export class DocumentBlock {
  @ApiProperty({ type: String, description: 'Unique identifier for the block' })
  @PrimaryGeneratedColumn('uuid')
  block_id: string;

  @ApiProperty({ type: String, description: 'Document ID associated with the block' })
  @Column()
  document_id: string;

  @ApiProperty({
    enum: BlockType,
    description: 'Type of the block',
  })
  @Column({
    type: 'enum',
    enum: BlockType,
    default: BlockType.PARAGRAPH,
  })
  type: BlockType;

  @ApiProperty({ type: 'json', description: 'Content of the block (JSON structure)' })
  @Column('jsonb')
  content: any;

  @ApiProperty({ type: Number, description: 'Order/position of the block in the document' })
  @Column({ type: 'int' })
  order: number;

  @ApiProperty({ type: String, description: 'Parent block ID for nesting', required: false })
  @Column({ nullable: true })
  parent_block_id?: string;

  @ApiProperty({ type: 'json', description: 'Block properties/metadata (JSON)', required: false })
  @Column('jsonb', { nullable: true })
  properties?: any;

  @ApiProperty({ type: Date, description: 'Creation date of the block' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date, description: 'Last update date of the block' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Document, (document) => document.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => DocumentBlock, (block) => block.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_block_id' })
  parent?: DocumentBlock;

  @OneToMany(() => DocumentBlock, (block) => block.parent)
  children: DocumentBlock[];

  @OneToMany(() => DocumentComment, (comment) => comment.block, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: DocumentComment[];
}
