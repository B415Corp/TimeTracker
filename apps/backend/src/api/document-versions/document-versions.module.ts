import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentVersionsService } from './document-versions.service';
import { DocumentVersionsController } from './document-versions.controller';
import { DocumentVersion } from '../../entities/document-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentVersion])],
  controllers: [DocumentVersionsController],
  providers: [DocumentVersionsService],
  exports: [DocumentVersionsService],
})
export class DocumentVersionsModule {}
