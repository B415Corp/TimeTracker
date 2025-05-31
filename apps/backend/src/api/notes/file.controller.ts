import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { File } from 'multer';

@Controller('notes/:noteId/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Param('noteId') noteId: string, @UploadedFile() file: File) {
    return this.fileService.uploadFile(noteId, file);
  }

  @Get()
  getFiles(@Param('noteId') noteId: string) {
    return this.fileService.getFiles(noteId);
  }

  @Delete(':fileId')
  deleteFile(@Param('fileId') fileId: string) {
    return this.fileService.deleteFile(fileId);
  }
} 