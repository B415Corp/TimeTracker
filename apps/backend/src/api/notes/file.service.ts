import { Injectable } from '@nestjs/common';
import { FileDto } from './dto/file.dto';
import { Express } from 'express';
import { File } from 'multer';

declare module 'express' {
  export interface Request {
    file?: File;
    files?: {
      [fieldname: string]: File[];
    };
  }
}

@Injectable()
export class FileService {
  async uploadFile(noteId: string, file: File): Promise<FileDto> {
    // TODO: Реализовать логику загрузки файла
    throw new Error('Method not implemented');
  }

  async getFiles(noteId: string): Promise<FileDto[]> {
    // TODO: Реализовать логику получения файлов
    throw new Error('Method not implemented');
  }

  async deleteFile(fileId: string): Promise<void> {
    // TODO: Реализовать логику удаления файла
    throw new Error('Method not implemented');
  }

  validateFile(file: File): boolean {
    // TODO: Реализовать логику валидации файла
    throw new Error('Method not implemented');
  }
} 