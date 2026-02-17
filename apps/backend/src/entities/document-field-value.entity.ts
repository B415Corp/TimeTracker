import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from './document.entity';
import { CustomField } from './custom-field.entity';

@Entity('document_field_values')
export class DocumentFieldValue {
  @ApiProperty({ type: String, description: 'Unique identifier for the field value' })
  @PrimaryGeneratedColumn('uuid')
  value_id: string;

  @ApiProperty({ type: String, description: 'Document ID associated with the value' })
  @Column()
  document_id: string;

  @ApiProperty({ type: String, description: 'Field ID associated with the value' })
  @Column()
  field_id: string;

  @ApiProperty({ type: 'json', description: 'Field value (JSON structure depends on field type)' })
  @Column('jsonb')
  value: any;

  // Relations
  @ManyToOne(() => Document, (document) => document.customFieldValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => CustomField, (field) => field.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  field: CustomField;
}
