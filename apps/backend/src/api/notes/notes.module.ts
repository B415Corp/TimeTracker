import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Notes } from '../../entities/notes.entity';
import { File } from '../../entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notes, File])
  ],
  controllers: [NotesController, FileController],
  providers: [
    NotesService,
    FileService,
  ],
  exports: [
    TypeOrmModule,
    NotesService,
    FileService
  ],
})
export class NotesModule {}
