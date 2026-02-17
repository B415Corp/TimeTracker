import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { FieldType } from '../common/enums/field-type.enum';
import { DocumentFieldValue } from './document-field-value.entity';

@Entity('custom_fields')
export class CustomField {
  @ApiProperty({ type: String, description: 'Unique identifier for the field' })
  @PrimaryGeneratedColumn('uuid')
  field_id: string;

  @ApiProperty({ type: String, description: 'Project ID associated with the field' })
  @Column()
  project_id: string;

  @ApiProperty({ type: String, description: 'Name of the field' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    enum: FieldType,
    description: 'Type of the field',
  })
  @Column({
    type: 'enum',
    enum: FieldType,
  })
  type: FieldType;

  @ApiProperty({ type: 'json', description: 'Field configuration (options for select, format for date, etc.)', required: false })
  @Column('jsonb', { nullable: true })
  config?: any;

  @ApiProperty({ type: Boolean, description: 'Is this field required' })
  @Column({ default: false })
  is_required: boolean;

  @ApiProperty({ type: Date, description: 'Creation date of the field' })
  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => DocumentFieldValue, (value) => value.field, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  values: DocumentFieldValue[];
}
