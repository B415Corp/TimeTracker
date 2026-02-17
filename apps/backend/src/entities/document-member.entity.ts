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
import { DocumentRole } from '../common/enums/document-role.enum';

@Entity('document_members')
export class DocumentMember {
  @ApiProperty({ type: String, description: 'Unique identifier for the document member' })
  @PrimaryGeneratedColumn('uuid')
  member_id: string;

  @ApiProperty({ type: String, description: 'Document ID' })
  @Column()
  document_id: string;

  @ApiProperty({ type: String, description: 'User ID' })
  @Column()
  user_id: string;

  @ApiProperty({
    enum: DocumentRole,
    description: 'Role of the user in the document',
  })
  @Column({
    type: 'enum',
    enum: DocumentRole,
    default: DocumentRole.VIEWER,
  })
  role: DocumentRole;

  @ApiProperty({ type: String, description: 'User ID who assigned this member' })
  @Column()
  assigned_by: string;

  @ApiProperty({ type: Date, description: 'Assignment date' })
  @CreateDateColumn()
  assigned_at: Date;

  // Relations
  @ManyToOne(() => Document, (document) => document.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assigned_by' })
  assigner: User;
}
