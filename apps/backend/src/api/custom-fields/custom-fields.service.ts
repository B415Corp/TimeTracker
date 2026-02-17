import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomField } from '../../entities/custom-field.entity';
import { DocumentFieldValue } from '../../entities/document-field-value.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { SetFieldValueDto } from './dto/set-field-value.dto';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private fieldsRepository: Repository<CustomField>,
    @InjectRepository(DocumentFieldValue)
    private fieldValuesRepository: Repository<DocumentFieldValue>,
  ) {}

  async create(
    projectId: string,
    createFieldDto: CreateFieldDto,
  ): Promise<CustomField> {
    const field = this.fieldsRepository.create({
      ...createFieldDto,
      project_id: projectId,
    });

    return this.fieldsRepository.save(field);
  }

  async findAllByProject(projectId: string): Promise<CustomField[]> {
    return this.fieldsRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(fieldId: string): Promise<CustomField> {
    const field = await this.fieldsRepository.findOne({
      where: { field_id: fieldId },
      relations: ['project'],
    });

    if (!field) {
      throw new NotFoundException(`Field with ID ${fieldId} not found`);
    }

    return field;
  }

  async update(
    fieldId: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<CustomField> {
    const field = await this.findOne(fieldId);

    Object.assign(field, updateFieldDto);

    return this.fieldsRepository.save(field);
  }

  async remove(fieldId: string): Promise<void> {
    const field = await this.findOne(fieldId);
    await this.fieldsRepository.remove(field);
  }

  async setFieldValue(
    documentId: string,
    fieldId: string,
    setFieldValueDto: SetFieldValueDto,
  ): Promise<DocumentFieldValue> {
    // Check if value already exists
    let fieldValue = await this.fieldValuesRepository.findOne({
      where: { document_id: documentId, field_id: fieldId },
    });

    if (fieldValue) {
      fieldValue.value = setFieldValueDto.value;
    } else {
      fieldValue = this.fieldValuesRepository.create({
        document_id: documentId,
        field_id: fieldId,
        value: setFieldValueDto.value,
      });
    }

    return this.fieldValuesRepository.save(fieldValue);
  }

  async getDocumentFieldValues(documentId: string): Promise<DocumentFieldValue[]> {
    return this.fieldValuesRepository.find({
      where: { document_id: documentId },
      relations: ['field'],
    });
  }
}
