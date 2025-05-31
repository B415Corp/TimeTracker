import { IsNotEmpty } from 'class-validator';
import { File } from 'multer';

export class FileDto {
  id: string;
  name: string;
  size: number;
  storageKey: string;
  mimeType: string;
  uploadedAt: string;
}

export class UploadFileDto {
  @IsNotEmpty()
  file: File;
} 