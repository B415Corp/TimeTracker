import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from '../../entities/document.entity';
import { DocumentFieldValue } from '../../entities/document-field-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentFieldValue])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
