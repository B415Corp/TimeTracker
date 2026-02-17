import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentFilesService } from './document-files.service';
import { DocumentFilesController } from './document-files.controller';
import { DocumentFile } from '../../entities/document-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentFile])],
  controllers: [DocumentFilesController],
  providers: [DocumentFilesService],
  exports: [DocumentFilesService],
})
export class DocumentFilesModule {}
