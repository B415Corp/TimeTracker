import { IsNotEmpty } from 'class-validator';
import { File } from 'multer';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ description: 'Уникальный идентификатор файла' })
  id: string;

  @ApiProperty({ description: 'Оригинальное имя файла' })
  name: string;

  @ApiProperty({ description: 'Размер файла в байтах' })
  size: number;

  @ApiProperty({ description: 'Ключ файла в хранилище' })
  storageKey: string;

  @ApiProperty({ description: 'MIME-тип файла' })
  mimeType: string;

  @ApiProperty({ description: 'Дата загрузки файла' })
  uploadedAt: string;
}

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Файл для загрузки'
  })
  @IsNotEmpty()
  file: File;
} 