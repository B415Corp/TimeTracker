import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomField } from '../../entities/custom-field.entity';
import { DocumentFieldValue } from '../../entities/document-field-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomField, DocumentFieldValue])],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService],
  exports: [CustomFieldsService],
})
export class CustomFieldsModule {}
